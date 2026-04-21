'use strict';

const db = require.main.require('./src/database');

const cache = module.exports;

// Discussion summary cache
cache.getDiscussionSummary = async function (tid) {
	const data = await db.getObjectFields(`topic:${tid}`, [
		'copai:summary', 'copai:summaryTs', 'copai:replyCount',
	]);
	return {
		summary: data['copai:summary'] || null,
		summaryTs: parseInt(data['copai:summaryTs'], 10) || 0,
		replyCount: parseInt(data['copai:replyCount'], 10) || 0,
	};
};

cache.setDiscussionSummary = async function (tid, summary, replyCount) {
	await db.setObject(`topic:${tid}`, {
		'copai:summary': summary,
		'copai:summaryTs': Date.now(),
		'copai:replyCount': replyCount,
	});
	await db.sortedSetAdd('copai:summarized:topics', Date.now(), tid);
};

cache.clearDiscussionSummary = async function (tids) {
	const keys = tids.map(tid => `topic:${tid}`);
	await db.deleteObjectFields(keys, ['copai:summary', 'copai:summaryTs', 'copai:replyCount']);
};

cache.isDiscussionCacheValid = function (cached, currentReplyCount, settings) {
	if (!cached.summary) {
		return false;
	}
	const cacheHours = parseInt(settings.discussionCacheHours, 10) || 12;
	const maxNewReplies = parseInt(settings.cacheInvalidationReplies, 10) || 10;
	const elapsed = Date.now() - cached.summaryTs;
	const hoursElapsed = elapsed / (1000 * 60 * 60);

	if (hoursElapsed >= cacheHours) {
		return false;
	}
	if ((currentReplyCount - cached.replyCount) >= maxNewReplies) {
		return false;
	}
	return true;
};

// Document summary cache
cache.getDocumentSummary = async function (docId) {
	const data = await db.getObjectFields(`document:${docId}`, [
		'ai:summary', 'ai:summaryTs',
	]);
	return {
		summary: data['ai:summary'] || null,
		summaryTs: parseInt(data['ai:summaryTs'], 10) || 0,
	};
};

cache.setDocumentSummary = async function (docId, summary) {
	await db.setObject(`document:${docId}`, {
		'ai:summary': summary,
		'ai:summaryTs': Date.now(),
	});
	await db.sortedSetAdd('copai:summarized:documents', Date.now(), docId);
};

cache.clearDocumentSummary = async function (docId) {
	await db.deleteObjectFields([`document:${docId}`], ['ai:summary', 'ai:summaryTs']);
};

// Catch-up digest cache
cache.getDigest = async function (uid) {
	const data = await db.getObject(`copai:digest:${uid}`);
	return data || null;
};

cache.getSharedDigest = async function () {
	const data = await db.getObject('copai:digest:shared');
	return data || null;
};

cache.setDigest = async function (uid, digest) {
	const now = Date.now();
	const payload = { content: digest, timestamp: now };
	await db.setObject(`copai:digest:${uid}`, payload);
	// Also store as shared digest so all members can see it
	await db.setObject('copai:digest:shared', payload);
	await db.sortedSetAdd('copai:digest:uids', now, uid);
};

cache.isDigestValid = function (cached, settings) {
	if (!cached || !cached.content) {
		return false;
	}
	const cacheHours = parseInt(settings.digestCacheHours, 10) || 6;
	const elapsed = Date.now() - parseInt(cached.timestamp, 10);
	return elapsed < (cacheHours * 60 * 60 * 1000);
};

// Bulk clear and count methods for admin cache management
cache.clearAllDiscussionSummaries = async function () {
	const tids = await db.getSortedSetRange('copai:summarized:topics', 0, -1);
	if (tids.length) {
		await cache.clearDiscussionSummary(tids);
		await db.delete('copai:summarized:topics');
	}
	return tids.length;
};

cache.clearAllDocumentSummaries = async function () {
	const docIds = await db.getSortedSetRange('copai:summarized:documents', 0, -1);
	if (docIds.length) {
		await Promise.all(docIds.map(docId => cache.clearDocumentSummary(docId)));
		await db.delete('copai:summarized:documents');
	}
	return docIds.length;
};

cache.clearAllDigests = async function () {
	const uids = await db.getSortedSetRange('copai:digest:uids', 0, -1);
	if (uids.length) {
		await Promise.all(uids.map(uid => db.delete(`copai:digest:${uid}`)));
		await db.delete('copai:digest:uids');
	}
	return uids.length;
};

cache.countDiscussionSummaries = async function () {
	return await db.sortedSetCard('copai:summarized:topics');
};

cache.countDocumentSummaries = async function () {
	return await db.sortedSetCard('copai:summarized:documents');
};

cache.countDigests = async function () {
	return await db.sortedSetCard('copai:digest:uids');
};
