'use strict';

const controllers = require('./lib/controllers');
const settings = require('./lib/settings');
const cache = require('./lib/cache');
const discussionSummary = require('./lib/discussion-summary');
const catchupDigest = require('./lib/catchup-digest');

const routeHelpers = require.main.require('./src/routes/helpers');
const privileges = require.main.require('./src/privileges');
const topics = require.main.require('./src/topics');
const socketPlugins = require.main.require('./src/socket.io/plugins');

const plugin = module.exports;

plugin.init = async function (params) {
	const { router, middleware } = params;

	// Admin page
	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/cop-ai', [], controllers.renderAdmin);

	// API routes — catchup digest (modal AJAX) + usage stats
	routeHelpers.setupApiRoute(router, 'get', '/api/v3/plugins/cop-ai/catchup', [middleware.ensureLoggedIn], controllers.getCatchupDigest);
	routeHelpers.setupApiRoute(router, 'get', '/api/v3/plugins/cop-ai/usage', [middleware.ensureLoggedIn], controllers.getUsageStats);

	// Admin cache management routes
	const adminMiddleware = [middleware.ensureLoggedIn, middleware.admin.checkPrivileges];
	routeHelpers.setupApiRoute(router, 'get', '/api/v3/plugins/cop-ai/cache/counts', adminMiddleware, controllers.getCacheCounts);
	routeHelpers.setupApiRoute(router, 'delete', '/api/v3/plugins/cop-ai/cache/discussions', adminMiddleware, controllers.clearDiscussionCache);
	routeHelpers.setupApiRoute(router, 'delete', '/api/v3/plugins/cop-ai/cache/documents', adminMiddleware, controllers.clearDocumentCache);
	routeHelpers.setupApiRoute(router, 'delete', '/api/v3/plugins/cop-ai/cache/digests', adminMiddleware, controllers.clearDigestCache);
	routeHelpers.setupApiRoute(router, 'delete', '/api/v3/plugins/cop-ai/cache/ratelimits', adminMiddleware, controllers.clearRateLimitData);
};

plugin.addAdminNavigation = async function (header) {
	header.plugins.push({
		route: '/plugins/cop-ai',
		icon: 'fa-robot',
		name: '[[cop-ai:admin.title]]',
	});
	return header;
};

// filter:topic.build — inject discussion summary data into topic template
plugin.filterTopicBuild = async function (hookData) {
	const currentSettings = await settings.get();
	if (currentSettings.enableDiscussionSummary !== 'on') {
		return hookData;
	}

	const uid = hookData.req ? hookData.req.uid : 0;
	const accessLevel = currentSettings.discussionSummaryAccess;
	if (accessLevel === 'disabled') return hookData;
	if (accessLevel === 'members' && !uid) return hookData;

	// Admins/mods always see the summarize button regardless of reply count
	const isPrivileged = uid ? await privileges.admin.can('admin:dashboard', uid) ||
		await privileges.users.isGlobalModerator([uid]).then(r => r[0]) : false;

	if (!isPrivileged) {
		// Regular users: enforce minimum replies
		const minReplies = parseInt(currentSettings.minRepliesForSummary, 10) || 15;
		const postcount = parseInt(hookData.templateData.postcount, 10) || 0;
		if (postcount < minReplies) {
			return hookData;
		}
	}

	hookData.templateData.canSummarize = true;

	// Read cached summary
	const tid = hookData.templateData.tid;
	const cached = await cache.getDiscussionSummary(tid);
	if (cached.summary) {
		hookData.templateData.aiSummary = cached.summary;
		hookData.templateData.aiSummaryTs = cached.summaryTs;
	}

	return hookData;
};

// filter:categories.build — inject catchup eligibility into categories template
plugin.filterCategoriesBuild = async function (hookData) {
	const currentSettings = await settings.get();
	if (currentSettings.enableCatchupDigest !== 'on') {
		return hookData;
	}

	const uid = hookData.req ? hookData.req.uid : 0;
	if (!uid) return hookData;

	const accessLevel = currentSettings.catchupDigestAccess;
	if (accessLevel === 'disabled') return hookData;

	try {
		// Admins/mods always see the catchup banner (for testing/demo)
		const isPrivileged = await privileges.admin.can('admin:dashboard', uid) ||
			(await privileges.users.isGlobalModerator([uid]))[0];

		if (isPrivileged) {
			hookData.templateData.showCatchupBanner = true;
			return hookData;
		}

		const eligible = await catchupDigest.isEligible(uid, currentSettings);
		if (eligible) {
			hookData.templateData.showCatchupBanner = true;
		}
	} catch (err) {
		// Silently fail — no banner shown
	}

	return hookData;
};

// Post action hooks — clear cache only on structural content changes
plugin.actionPostsPurge = async function (hookData) {
	const tids = [...new Set(hookData.posts.map(p => p.tid))];
	await cache.clearDiscussionSummary(tids);
};

plugin.actionPostDelete = async function (hookData) {
	await cache.clearDiscussionSummary([hookData.post.tid]);
};

plugin.actionPostMove = async function (hookData) {
	await cache.clearDiscussionSummary([hookData.post.tid, hookData.tid]);
};

plugin.actionPostChangeOwner = async function (hookData) {
	const tids = [...new Set(hookData.posts.map(p => p.tid))];
	await cache.clearDiscussionSummary(tids);
};

// Document hooks
plugin.onDocumentApproved = async function (hookData) {
	try {
		const documentSummary = require('./lib/document-summary');
		const currentSettings = await settings.get();
		if (currentSettings.enableDocSummary !== 'on' || (!currentSettings.apiKey && !(currentSettings.provider === 'agent-sdk' && currentSettings.loginMethod === 'claudeai'))) {
			return;
		}
		await documentSummary.summarize(hookData.docId, null, currentSettings);
	} catch (err) {
		console.error('[cop-ai] Auto-summarize on approval failed:', err.message);
	}
};

plugin.onDocumentVersionUploaded = async function (hookData) {
	await cache.clearDocumentSummary(hookData.docId);
};

// Socket handler for discussion summarization
socketPlugins.copai = {};

socketPlugins.copai.summarizeTopic = async function (socket, data) {
	const { tid } = data;
	if (!tid) {
		throw new Error('[[error:invalid-data]]');
	}

	if (!await privileges.topics.can('topics:read', tid, socket.uid)) {
		throw new Error('[[error:no-privileges]]');
	}

	const currentSettings = await settings.get();
	if (currentSettings.enableDiscussionSummary !== 'on') {
		throw new Error('[[cop-ai:error.feature_disabled]]');
	}
	if (!currentSettings.apiKey && !(currentSettings.provider === 'agent-sdk' && currentSettings.loginMethod === 'claudeai')) {
		throw new Error('[[cop-ai:error.no_api_key]]');
	}

	return await discussionSummary.summarize(tid, socket.uid, currentSettings);
};
