'use strict';

const meta = require.main.require('./src/meta');

const DEFAULTS = {
	provider: 'openai',
	apiKey: '',
	model: 'gpt-4o-mini',
	apiBaseUrl: '',
	loginMethod: 'api-key',

	enableDocSummary: 'on',
	enableDiscussionSummary: 'on',
	enableCatchupDigest: 'on',

	docSummaryAccess: 'members',
	discussionSummaryAccess: 'members',
	catchupDigestAccess: 'members',

	minRepliesForSummary: '15',
	cacheInvalidationReplies: '10',
	discussionCacheHours: '12',
	digestCacheHours: '6',
	dailySummaryLimit: '5',
	catchupAbsenceDays: '14',
};

exports.DEFAULTS = DEFAULTS;

exports.get = async function () {
	const settings = await meta.settings.get('cop-ai');
	return { ...DEFAULTS, ...settings };
};
