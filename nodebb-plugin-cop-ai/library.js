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

	// Read cached summary first — it affects what we show
	const tid = hookData.templateData.tid;
	const cached = await cache.getDiscussionSummary(tid);

	if (!isPrivileged) {
		// Regular users: enforce minimum replies for the generate button
		const minReplies = parseInt(currentSettings.minRepliesForSummary, 10) || 15;
		const postcount = parseInt(hookData.templateData.postcount, 10) || 0;
		if (postcount < minReplies && !cached.summary) {
			// No cached summary and not enough replies — hide everything
			return hookData;
		}
	}

	// Show the summary section
	hookData.templateData.canSummarize = true;
	// Only admins/mods can generate/refresh summaries
	hookData.templateData.canGenerateSummary = isPrivileged;
	if (cached.summary) {
		hookData.templateData.aiSummary = cached.summary;
		hookData.templateData.aiSummaryTs = cached.summaryTs;
		// Truncated preview: strip markdown then truncate
		const maxPreview = 280;
		let plain = cached.summary
			.replace(/\*\*(.+?)\*\*/g, '$1')
			.replace(/\*(.+?)\*/g, '$1')
			.replace(/^#{1,6}\s+/gm, '')
			.replace(/^[-•]\s+/gm, '')
			.replace(/^\d+[.)]\s+/gm, '')
			.replace(/^-{3,}$/gm, '')
			.replace(/\n{2,}/g, ' ')
			.replace(/\n/g, ' ')
			.replace(/\s{2,}/g, ' ')
			.trim();
		if (plain.length > maxPreview) {
			plain = plain.slice(0, maxPreview);
			const lastSpace = plain.lastIndexOf(' ');
			if (lastSpace > maxPreview * 0.7) {
				plain = plain.slice(0, lastSpace);
			}
			plain += '…';
		}
		hookData.templateData.aiSummaryPreview = plain;
	}

	return hookData;
};

// filter:categories.build — inject sidebar widget data into categories template
plugin.filterCategoriesBuild = async function (hookData) {
	const uid = hookData.req ? hookData.req.uid : 0;
	const isLoggedIn = !!uid;
	hookData.templateData.isLoggedIn = isLoggedIn;

	let isAdmin = false;
	if (uid) {
		try {
			isAdmin = await privileges.admin.can('admin:dashboard', uid) ||
				(await privileges.users.isGlobalModerator([uid]))[0];
		} catch (err) { /* ignore */ }
	}
	hookData.templateData.isAdmin = isAdmin;

	// Digest widget — for logged-in members when feature enabled
	const currentSettings = await settings.get();
	if (currentSettings.enableCatchupDigest === 'on' && isLoggedIn) {
		const accessLevel = currentSettings.catchupDigestAccess;
		if (accessLevel !== 'disabled') {
			hookData.templateData.showDigestWidget = true;
			// Check cached digest — admins see their own, members see the shared one
			try {
				let cached;
				if (isAdmin) {
					cached = await cache.getDigest(uid);
				}
				if (!cached || !cached.content || !cache.isDigestValid(cached, currentSettings)) {
					cached = await cache.getSharedDigest();
				}
				if (cached && cached.content && cache.isDigestValid(cached, currentSettings)) {
					hookData.templateData.digestContent = cached.content;
				}
			} catch (err) { /* ignore */ }
		}
	}

	// Events widget — upcoming + recent past
	try {
		const eventsLib = require('nodebb-plugin-cop-events/lib/events');
		const upcomingEvents = await eventsLib.getUpcoming(0, 2);
		hookData.templateData.upcomingEvents = upcomingEvents || [];
		// Show up to 2 recent past events if fewer than 3 upcoming
		const pastSlots = 3 - (upcomingEvents ? upcomingEvents.length : 0);
		if (pastSlots > 0) {
			const pastEvents = await eventsLib.getPast(0, pastSlots - 1);
			hookData.templateData.pastEvents = pastEvents || [];
		} else {
			hookData.templateData.pastEvents = [];
		}
	} catch (err) {
		hookData.templateData.upcomingEvents = [];
		hookData.templateData.pastEvents = [];
	}

	// Recent documents widget
	try {
		const docsLib = require('nodebb-plugin-cop-documents/lib/documents');
		const result = await docsLib.getApproved({}, 1, 3, ['public', 'members']);
		hookData.templateData.recentDocuments = (result && result.docs) || [];
	} catch (err) {
		hookData.templateData.recentDocuments = [];
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
