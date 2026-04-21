'use strict';

const settings = require('./settings');
const documentSummary = require('./document-summary');
const catchupDigest = require('./catchup-digest');
const rateLimit = require('./rate-limit');
const cache = require('./cache');

const controllers = module.exports;

controllers.renderAdmin = async function (req, res) {
	res.render('admin/plugins/cop-ai', {
		title: '[[cop-ai:admin.title]]',
	});
};

controllers.getDocumentSummary = async function (req, res) {
	try {
		const { docId } = req.params;
		const uid = req.uid;
		const currentSettings = await settings.get();

		if (currentSettings.enableDocSummary !== 'on') {
			return res.status(403).json({ status: { message: '[[cop-ai:error.feature_disabled]]' } });
		}

		if (!checkAccess(uid, currentSettings.docSummaryAccess)) {
			return res.status(403).json({ status: { message: '[[error:no-privileges]]' } });
		}

		const cache = require('./cache');
		const cached = await cache.getDocumentSummary(docId);
		if (cached.summary) {
			return res.json({ response: { summary: cached.summary, cached: true } });
		}
		return res.json({ response: { summary: null, cached: false } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.generateDocumentSummary = async function (req, res) {
	try {
		const { docId } = req.params;
		const uid = req.uid;
		const currentSettings = await settings.get();

		if (currentSettings.enableDocSummary !== 'on') {
			return res.status(403).json({ status: { message: '[[cop-ai:error.feature_disabled]]' } });
		}
		if (!checkAccess(uid, currentSettings.docSummaryAccess)) {
			return res.status(403).json({ status: { message: '[[error:no-privileges]]' } });
		}
		if (!currentSettings.apiKey && !(currentSettings.provider === 'agent-sdk' && currentSettings.loginMethod === 'claudeai')) {
			return res.status(500).json({ status: { message: '[[cop-ai:error.no_api_key]]' } });
		}

		const summary = await documentSummary.summarize(docId, uid, currentSettings);
		return res.json({ response: { summary } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.checkCatchupEligible = async function (req, res) {
	try {
		const uid = req.uid;
		const currentSettings = await settings.get();

		if (currentSettings.enableCatchupDigest !== 'on' || !uid) {
			return res.json({ response: { eligible: false } });
		}
		if (!checkAccess(uid, currentSettings.catchupDigestAccess)) {
			return res.json({ response: { eligible: false } });
		}

		const eligible = await catchupDigest.isEligible(uid, currentSettings);
		return res.json({ response: { eligible } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.getCatchupDigest = async function (req, res) {
	try {
		const uid = req.uid;
		const currentSettings = await settings.get();

		if (currentSettings.enableCatchupDigest !== 'on' || !uid) {
			return res.status(403).json({ status: { message: '[[cop-ai:error.feature_disabled]]' } });
		}
		if (!checkAccess(uid, currentSettings.catchupDigestAccess)) {
			return res.status(403).json({ status: { message: '[[error:no-privileges]]' } });
		}
		if (!currentSettings.apiKey && !(currentSettings.provider === 'agent-sdk' && currentSettings.loginMethod === 'claudeai')) {
			return res.status(500).json({ status: { message: '[[cop-ai:error.no_api_key]]' } });
		}

		const digest = await catchupDigest.generate(uid, currentSettings);
		return res.json({ response: { digest } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.getUsageStats = async function (req, res) {
	try {
		const [discussion, document, catchup] = await Promise.all([
			rateLimit.getUsageStats('discussion'),
			rateLimit.getUsageStats('document'),
			rateLimit.getUsageStats('catchup'),
		]);
		return res.json({ response: { discussion, document, catchup } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.getCacheCounts = async function (req, res) {
	try {
		const [discussions, documents, digests, rateLimitKeys] = await Promise.all([
			cache.countDiscussionSummaries(),
			cache.countDocumentSummaries(),
			cache.countDigests(),
			rateLimit.countKeys(),
		]);
		return res.json({ response: { discussions, documents, digests, rateLimitKeys } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.clearDiscussionCache = async function (req, res) {
	try {
		const count = await cache.clearAllDiscussionSummaries();
		return res.json({ response: { cleared: count } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.clearDocumentCache = async function (req, res) {
	try {
		const count = await cache.clearAllDocumentSummaries();
		return res.json({ response: { cleared: count } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.clearDigestCache = async function (req, res) {
	try {
		const count = await cache.clearAllDigests();
		return res.json({ response: { cleared: count } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

controllers.clearRateLimitData = async function (req, res) {
	try {
		const count = await rateLimit.cleanupOldKeys();
		return res.json({ response: { cleared: count } });
	} catch (err) {
		return res.status(500).json({ status: { message: err.message } });
	}
};

function checkAccess(uid, accessLevel) {
	if (accessLevel === 'disabled') return false;
	if (accessLevel === 'all') return true;
	if (accessLevel === 'members' && uid) return true;
	return false;
}
