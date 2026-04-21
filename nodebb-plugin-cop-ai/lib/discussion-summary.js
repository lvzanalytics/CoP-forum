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

function chunkPosts(postList, maxTokensPerChunk = 3000) {
	const chunks = [];
	let currentChunk = [];
	let currentTokens = 0;

	for (const post of postList) {
		const estimatedTokens = Math.ceil((post.content || '').length / 4) + 10;
		if (currentTokens + estimatedTokens > maxTokensPerChunk && currentChunk.length > 0) {
			chunks.push(currentChunk);
			currentChunk = [];
			currentTokens = 0;
		}
		currentChunk.push(post);
		currentTokens += estimatedTokens;
	}
	if (currentChunk.length > 0) {
		chunks.push(currentChunk);
	}
	return chunks;
}

function formatPosts(postList) {
	return postList
		.map(p => `${p.username} :\n${p.content}`)
		.join('\n---\n');
}

discussionSummary.summarize = async function (tid, uid, settings) {
	// Check rate limit
	const allowed = await rateLimit.check(uid, 'discussion', settings);
	if (!allowed) {
		throw new Error('[[cop-ai:error.rate_limit]]');
	}

	// Check cache
	const topicData = await topics.getTopicFields(tid, ['postcount']);
	const currentReplyCount = parseInt(topicData.postcount, 10) || 0;
	const cached = await cache.getDiscussionSummary(tid);

	if (cache.isDiscussionCacheValid(cached, currentReplyCount, settings)) {
		return cached.summary;
	}

	// Generate summary
	const summary = await generateSummary(tid, settings);

	// Cache result
	await cache.setDiscussionSummary(tid, summary, currentReplyCount);

	// Track usage
	await rateLimit.increment(uid, 'discussion');

	return summary;
};

async function generateSummary(tid, settings) {
	const allPids = await topics.getPids(tid);
	const userMap = {};
	const allPostData = [];

	await batch.processArray(allPids, async function (pids) {
		let postData = await posts.getPostsFields(pids, ['uid', 'content', 'deleted']);
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
			p.username = userMap[p.uid] || 'Unknown';
		});

		allPostData.push(...postData);
	}, { batch: 500 });

	// Strip PII
	const { posts: sanitizedPosts } = sanitize.stripPII(allPostData);

	const chunks = chunkPosts(sanitizedPosts);

	if (chunks.length === 1) {
		const text = formatPosts(chunks[0]);
		const result = await provider.generate(
			prompts.DISCUSSION_SUMMARY_SYSTEM,
			`Résumez la discussion suivante :\n\n${text}`,
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
			`Résumez cet extrait de discussion :\n\n${text}`,
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
		`Voici les résumés partiels d'une discussion :\n\n${combined}\n\nProduisez la synthèse finale.`,
		settings
	);
	if (finalResult.usage) {
		await rateLimit.trackUsage('discussion', finalResult.usage.totalTokens || 0);
	}
	return finalResult.text;
}
