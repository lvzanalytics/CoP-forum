'use strict';

const db = require.main.require('./src/database');

const rateLimit = module.exports;

function getTodayKey(feature) {
	const today = new Date().toISOString().slice(0, 10);
	return `copai:limit:${feature}:${today}`;
}

function getMonthKey(feature) {
	const month = new Date().toISOString().slice(0, 7);
	return `copai:usage:${feature}:${month}`;
}

rateLimit.check = async function (uid, feature, settings) {
	const limit = parseInt(settings.dailySummaryLimit, 10) || 5;
	const key = getTodayKey(feature);
	const count = await db.sortedSetCount(key, '-inf', '+inf');
	const userCount = await db.sortedSetScore(key, uid);
	return (userCount || 0) < limit;
};

rateLimit.increment = async function (uid, feature) {
	const key = getTodayKey(feature);
	const current = await db.sortedSetScore(key, uid);
	await db.sortedSetAdd(key, (current || 0) + 1, uid);
	// Track the key for cleanup
	await db.sortedSetAdd('copai:limit:keys', Date.now(), key);
	// Set expiry on the key (end of day + buffer)
	await db.pexpireAt(key, endOfDay());
};

rateLimit.trackUsage = async function (feature, tokens) {
	const key = getMonthKey(feature);
	const today = new Date().toISOString().slice(0, 10);
	const current = await db.sortedSetScore(key, today);
	await db.sortedSetAdd(key, (current || 0) + tokens, today);
};

rateLimit.getUsageStats = async function (feature) {
	const key = getMonthKey(feature);
	const entries = await db.getSortedSetRangeWithScores(key, 0, -1);
	return entries.map(e => ({ date: e.value, tokens: e.score }));
};

rateLimit.cleanupOldKeys = async function () {
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);
	const oldKeys = await db.getSortedSetRangeByScore('copai:limit:keys', 0, -1, '-inf', startOfToday.getTime() - 1);
	if (oldKeys.length) {
		await Promise.all(oldKeys.map(key => db.delete(key)));
		await db.sortedSetRemove('copai:limit:keys', oldKeys);
	}
	return oldKeys.length;
};

rateLimit.countKeys = async function () {
	return await db.sortedSetCard('copai:limit:keys');
};

function endOfDay() {
	const now = new Date();
	const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
	return end.getTime();
}
