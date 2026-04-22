'use strict';

const batch = require.main.require('./src/batch');
const topics = require.main.require('./src/topics');
const posts = require.main.require('./src/posts');
const user = require.main.require('./src/user');

const provider = require('./provider');
const cache = require('./cache');
const rateLimit = require('./rate-limit');
const sanitize = require('./sanitize');
const prompts = require('./prompts');

const discussionSummary = module.exports;

// 80k tokens ≈ 320k chars. Same unit and thresholds as document-summary.js.
const MAX_CHARS_PER_CHUNK = 320000;

function chunkPosts(postList) {
	const chunks = [];
	let currentChunk = [];
	let currentChars = 0;

	for (const post of postList) {
		const len = (post.content || '').length;
		if (currentChars + len > MAX_CHARS_PER_CHUNK && currentChunk.length > 0) {
			chunks.push(currentChunk);
			currentChunk = [];
			currentChars = 0;
		}
		currentChunk.push(post);
		currentChars += len;
	}
	if (currentChunk.length > 0) {
		chunks.push(currentChunk);
	}
	return chunks;
}

function formatPosts(postList) {
	return postList
		.map((p, i) => {
			const role = i === 0 && p.isAuthor ? ' (auteur du sujet)' : '';
			return `**${p.username}**${role} :\n${p.content}`;
		})
		.join('\n\n---\n\n');
}

function buildContext(postList) {
	const authorPost = postList.find(p => p.isAuthor);
	const repliers = [...new Set(postList.filter(p => !p.isAuthor).map(p => p.username))];
	const replyCount = postList.filter(p => !p.isAuthor).length;

	return {
		author: authorPost ? authorPost.username : 'Inconnu',
		replyCount,
		replierCount: repliers.length,
	};
}

discussionSummary.summarize = async function (tid, uid, settings) {
	// Check rate limit
	const allowed = await rateLimit.check(uid, 'discussion', settings);
	if (!allowed) {
		throw new Error('[[cop-ai:error.rate_limit]]');
	}

	// Check cache
	const topicData = await topics.getTopicFields(tid, ['postcount', 'title']);
	const currentReplyCount = parseInt(topicData.postcount, 10) || 0;
	const cached = await cache.getDiscussionSummary(tid);

	if (cache.isDiscussionCacheValid(cached, currentReplyCount, settings)) {
		return cached.summary;
	}

	// Generate summary
	const summary = await generateSummary(tid, topicData.title, settings);

	// Cache result
	await cache.setDiscussionSummary(tid, summary, currentReplyCount);

	// Track usage
	await rateLimit.increment(uid, 'discussion');

	return summary;
};

async function generateSummary(tid, topicTitle, settings) {
	const allPids = await topics.getPids(tid);
	const userMap = {};
	const allPostData = [];

	await batch.processArray(allPids, async function (pids) {
		let postData = await posts.getPostsFields(pids, ['uid', 'content', 'deleted', 'upvotes', 'timestamp']);
		postData = postData.filter(p => p && !p.deleted);

		const missingUids = postData
			.filter(p => !userMap.hasOwnProperty(p.uid))
			.map(p => p.uid);

		if (missingUids.length) {
			const userData = await user.getUsersFields(missingUids, ['uid', 'username']);
			userData.forEach((u) => {
				userMap[u.uid] = u.username;
			});
		}

		postData.forEach((p) => {
			p.username = userMap[p.uid] || 'Inconnu';
		});

		allPostData.push(...postData);
	}, { batch: 500 });

	// Clean content (strip HTML, emails) but keep usernames
	const { posts: cleanedPosts } = sanitize.cleanContent(allPostData);
	const context = buildContext(cleanedPosts);

	const contextLine = `Titre de la discussion : « ${topicTitle} »\n` +
		`Auteur : ${context.author} | ${context.replyCount} réponse(s) de ${context.replierCount} intervenant(s)\n\n`;

	const chunks = chunkPosts(cleanedPosts);

	if (chunks.length === 1) {
		const text = formatPosts(chunks[0]);
		const result = await provider.generate(
			prompts.DISCUSSION_SUMMARY_SYSTEM,
			`${contextLine}${text}`,
			settings
		);
		if (result.usage) {
			await rateLimit.trackUsage('discussion', result.usage.totalTokens || 0);
		}
		return result.text;
	}

	// Multi-pass: summarize each chunk, then combine
	const chunkSummaries = [];
	for (const chunk of chunks) {
		const text = formatPosts(chunk);
		const result = await provider.generate(
			prompts.DISCUSSION_CHUNK_SYSTEM,
			`${contextLine}${text}`,
			settings
		);
		if (result.text) {
			chunkSummaries.push(result.text);
		}
		if (result.usage) {
			await rateLimit.trackUsage('discussion', result.usage.totalTokens || 0);
		}
	}

	// Final synthesis
	const combined = chunkSummaries.join('\n\n');
	const finalResult = await provider.generate(
		prompts.DISCUSSION_FINAL_SYSTEM,
		`${contextLine}Résumés partiels :\n\n${combined}\n\nProduisez la synthèse finale.`,
		settings
	);
	if (finalResult.usage) {
		await rateLimit.trackUsage('discussion', finalResult.usage.totalTokens || 0);
	}
	return finalResult.text;
}
