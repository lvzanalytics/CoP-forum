'use strict';

const db = require.main.require('./src/database');
const user = require.main.require('./src/user');
const topics = require.main.require('./src/topics');
const categories = require.main.require('./src/categories');

const posts = require.main.require('./src/posts');

const provider = require('./provider');
const cache = require('./cache');
const rateLimit = require('./rate-limit');
const prompts = require('./prompts');

const catchupDigest = module.exports;

catchupDigest.isEligible = async function (uid, settings) {
	const lastonline = await user.getUserField(uid, 'lastonline');
	if (!lastonline) {
		return false;
	}
	const absenceDays = parseInt(settings.catchupAbsenceDays, 10) || 14;
	const threshold = absenceDays * 24 * 60 * 60 * 1000;
	return (Date.now() - parseInt(lastonline, 10)) >= threshold;
};

catchupDigest.generate = async function (uid, settings) {
	// Check cache
	const cached = await cache.getDigest(uid);
	if (cache.isDigestValid(cached, settings)) {
		return cached.content;
	}

	// Check rate limit
	const allowed = await rateLimit.check(uid, 'catchup', settings);
	if (!allowed) {
		throw new Error('[[cop-ai:error.rate_limit]]');
	}

	const lastonline = await user.getUserField(uid, 'lastonline');
	const since = parseInt(lastonline, 10) || (Date.now() - 14 * 24 * 60 * 60 * 1000);

	// Get recent topics since user was last online
	const tids = await db.getSortedSetRangeByScore('topics:recent', 0, 50, since, '+inf');
	if (!tids.length) {
		return null;
	}

	const topicData = await topics.getTopicsFields(tids, ['tid', 'title', 'cid', 'postcount', 'mainPid', 'copai:summary']);

	// For topics without a cached summary, fetch first-post excerpt
	const needExcerpt = topicData.filter(t => t && t.mainPid && !t['copai:summary']);
	if (needExcerpt.length) {
		const pids = needExcerpt.map(t => t.mainPid);
		const postData = await posts.getPostsFields(pids, ['content']);
		needExcerpt.forEach((topic, i) => {
			const content = (postData[i] && postData[i].content) || '';
			// Strip HTML tags and take first 200 chars
			const plain = content.replace(/<[^>]+>/g, '').trim();
			topic._excerpt = plain.length > 200 ? plain.slice(0, 200) + '…' : plain;
		});
	}

	// Group by category
	const cids = [...new Set(topicData.map(t => t.cid).filter(Boolean))];
	const categoryData = await categories.getCategoriesFields(cids, ['cid', 'name']);
	const categoryMap = {};
	categoryData.forEach((c) => {
		categoryMap[c.cid] = c.name;
	});

	const grouped = {};
	for (const topic of topicData) {
		if (!topic || !topic.cid) continue;
		const catName = categoryMap[topic.cid] || 'Autre';
		if (!grouped[catName]) {
			grouped[catName] = [];
		}

		// Use cached summary if available, then first-post excerpt, then title
		let summary = topic['copai:summary'];
		if (!summary) {
			summary = topic._excerpt || topic.title;
		}
		grouped[catName].push({ title: topic.title, summary });
	}

	// Build digest input
	const digestInput = Object.entries(grouped).map(([cat, topicsList]) => {
		const items = topicsList.map(t => `- ${t.title}${t.summary !== t.title ? ` : ${t.summary}` : ''}`).join('\n');
		return `## ${cat}\n${items}`;
	}).join('\n\n');

	const result = await provider.generate(
		prompts.CATCHUP_SYSTEM,
		`L'utilisateur était absent depuis ${Math.round((Date.now() - since) / (24 * 60 * 60 * 1000))} jours. Voici les discussions récentes :\n\n${digestInput}\n\nProduisez un résumé de rattrapage.`,
		settings
	);

	// Cache
	await cache.setDigest(uid, result.text);

	// Track
	if (result.usage) {
		await rateLimit.trackUsage('catchup', result.usage.totalTokens || 0);
	}
	await rateLimit.increment(uid, 'catchup');

	return result.text;
};
