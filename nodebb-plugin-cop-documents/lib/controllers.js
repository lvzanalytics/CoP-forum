'use strict';

const path = require('path');

const nconf = require.main.require('nconf');
const meta = require.main.require('./src/meta');
const pagination = require.main.require('./src/pagination');
const controllerHelpers = require.main.require('./src/controllers/helpers');
const User = require.main.require('./src/user');

const documents = require('./documents');
const storage = require('./storage');
const moderation = require('./moderation');

const controllers = module.exports;

const DOCS_PER_PAGE = 20;

const DEFAULT_SETTINGS = {
	maxFileSize: '20',
	allowedExtensions: 'pdf,docx,xlsx,pptx,jpg,png',
	autoApproveCategories: '',
	r2AccountId: '',
	r2AccessKeyId: '',
	r2SecretAccessKey: '',
	r2Bucket: '',
	r2PublicUrl: '',
};

const DOC_CATEGORIES = ['reports', 'tools', 'policy', 'cases', 'training'];

async function getSettings() {
	const settings = await meta.settings.get('cop-documents');
	return { ...DEFAULT_SETTINGS, ...settings };
}

controllers.list = async function (req, res) {
	const page = Math.max(1, parseInt(req.query.page, 10) || 1);
	const filters = {
		category: req.query.category || '',
		region: req.query.region || '',
		sector: req.query.sector || '',
		tag: req.query.tag || '',
		q: req.query.q || '',
		sort: req.query.sort || 'newest',
	};

	const { docs, total } = await documents.getApproved(filters, page, DOCS_PER_PAGE);
	const pageCount = Math.max(1, Math.ceil(total / DOCS_PER_PAGE));

	const queryObj = { ...req.query };
	delete queryObj.page;

	const categoryOptions = DOC_CATEGORIES.map(c => ({
		value: c,
		label: `[[cop-documents:doc_category.${c}]]`,
		selected: c === filters.category,
	}));

	const sortOptions = [
		{ value: 'newest', label: '[[cop-documents:library.sort_newest]]', selected: filters.sort === 'newest' },
		{ value: 'oldest', label: '[[cop-documents:library.sort_oldest]]', selected: filters.sort === 'oldest' },
		{ value: 'popular', label: '[[cop-documents:library.sort_popular]]', selected: filters.sort === 'popular' },
	];

	res.render('documents/list', {
		title: '[[cop-documents:library.title]]',
		documents: docs,
		filters: filters,
		categoryOptions: categoryOptions,
		sortOptions: sortOptions,
		pagination: pagination.create(page, pageCount, queryObj),
		loggedIn: req.loggedIn,
	});
};

controllers.upload = async function (req, res) {
	const categoryOptions = DOC_CATEGORIES.map(c => ({
		value: c,
		label: `[[cop-documents:doc_category.${c}]]`,
	}));
	res.render('documents/upload', {
		title: '[[cop-documents:upload.title]]',
		categoryOptions: categoryOptions,
	});
};

controllers.view = async function (req, res) {
	const { docId } = req.params;
	const doc = await documents.getByDocId(docId);
	if (!doc || (!doc.docId && doc.docId !== 0)) {
		return controllerHelpers.notFound(req, res);
	}

	// Check access: if members-only, must be logged in
	if (doc.access === 'members' && !req.loggedIn) {
		return controllerHelpers.notAllowed(req, res);
	}

	// Only show approved docs to non-mods, unless it's the uploader
	if (doc.status !== 'approved') {
		const canMod = req.uid ? await moderation.canModerate(req.uid) : false;
		const isUploader = req.uid && String(req.uid) === String(doc.uid);
		if (!canMod && !isUploader) {
			return controllerHelpers.notFound(req, res);
		}
	}

	const versions = await documents.getVersions(docId);
	const canMod = req.uid ? await moderation.canModerate(req.uid) : false;

	// Parse tags
	let tags = [];
	if (doc.tags) {
		tags = typeof doc.tags === 'string' ? doc.tags.split(',').map(t => t.trim()).filter(Boolean) : doc.tags;
	}

	res.render('documents/view', {
		title: doc.title,
		document: {
			...doc,
			tagsArray: tags,
			categoryLabel: `[[cop-documents:doc_category.${doc.category}]]`,
			accessLabel: `[[cop-documents:access.${doc.access}]]`,
		},
		versions: versions,
		canModerate: canMod,
		loggedIn: req.loggedIn,
	});
};

controllers.pending = async function (req, res) {
	const canMod = await moderation.canModerate(req.uid);
	if (!canMod) {
		return controllerHelpers.notAllowed(req, res);
	}

	const docs = await documents.getPending();
	res.render('documents/pending', {
		title: '[[cop-documents:moderation.title]]',
		documents: docs,
	});
};

controllers.handleUpload = async function (req, res) {
	if (!req.uid) {
		return controllerHelpers.formatApiResponse(401, res, new Error('[[error:not-logged-in]]'));
	}

	const file = req.files && req.files[0];
	if (!file) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:upload.error_file]]'));
	}

	const { title, author, date, description, category, tags, region, sector, sourceOrg, pubDate, language, access } = req.body;

	// Validate required fields
	if (!title || !author || !date || !description || !category || !tags) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:upload.error_required]]'));
	}

	if (description.length < 50) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:upload.error_description]]'));
	}

	// Validate extension
	const settings = await getSettings();
	const allowedExts = settings.allowedExtensions.split(',').map(e => e.trim().toLowerCase());
	const fileExt = path.extname(file.originalname).replace('.', '').toLowerCase();
	if (!allowedExts.includes(fileExt)) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:upload.error_extension]]'));
	}

	// Validate file size
	const maxSize = parseInt(settings.maxFileSize, 10) * 1024 * 1024;
	if (file.size > maxSize) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:upload.error_size]]'));
	}

	// Save file
	const savedFile = await storage.save({
		name: `${Date.now()}-${file.originalname}`,
		path: file.path,
	});

	// Check auto-approval
	const autoApprove = settings.autoApproveCategories
		? settings.autoApproveCategories.split(',').map(c => c.trim())
		: [];
	const status = autoApprove.includes(category) ? 'approved' : 'pending';

	const docData = {
		title,
		author,
		date,
		description,
		category,
		tags,
		region: region || '',
		sector: sector || '',
		sourceOrg: sourceOrg || '',
		pubDate: pubDate || '',
		language: language || 'fr',
		access: access || 'public',
		fileUrl: savedFile.url,
		filePath: savedFile.path,
		fileName: file.originalname,
		fileSize: file.size,
		fileExt: fileExt,
		uid: req.uid,
		status: status,
	};

	const doc = await documents.create(docData);

	return controllerHelpers.formatApiResponse(200, res, {
		docId: doc.docId,
		status: doc.status,
		redirectUrl: `${nconf.get('relative_path')}/documents/${doc.docId}/${encodeURIComponent(doc.slug)}`,
	});
};

controllers.handleApprove = async function (req, res) {
	const canMod = await moderation.canModerate(req.uid);
	if (!canMod) {
		return controllerHelpers.formatApiResponse(403, res, new Error('[[error:no-privileges]]'));
	}

	await documents.approve(req.params.docId, req.uid);
	return controllerHelpers.formatApiResponse(200, res, { status: 'approved' });
};

controllers.handleReject = async function (req, res) {
	const canMod = await moderation.canModerate(req.uid);
	if (!canMod) {
		return controllerHelpers.formatApiResponse(403, res, new Error('[[error:no-privileges]]'));
	}

	const { reason } = req.body;
	if (!reason) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:moderation.reject_reason]]'));
	}

	await documents.reject(req.params.docId, req.uid, reason);
	return controllerHelpers.formatApiResponse(200, res, { status: 'rejected' });
};

controllers.handleDelete = async function (req, res) {
	const canMod = await moderation.canModerate(req.uid);
	if (!canMod) {
		return controllerHelpers.formatApiResponse(403, res, new Error('[[error:no-privileges]]'));
	}

	await documents.remove(req.params.docId);
	return controllerHelpers.formatApiResponse(200, res, {});
};

controllers.handleDownload = async function (req, res) {
	const doc = await documents.getByDocId(req.params.docId);
	if (!doc || !doc.docId) {
		return controllerHelpers.formatApiResponse(404, res, new Error('[[error:not-found]]'));
	}

	if (doc.access === 'members' && !req.loggedIn) {
		return controllerHelpers.formatApiResponse(403, res, new Error('[[error:no-privileges]]'));
	}

	await documents.incrementDownloads(req.params.docId);
	return controllerHelpers.formatApiResponse(200, res, { url: doc.fileUrl });
};

controllers.handleVersionUpload = async function (req, res) {
	if (!req.uid) {
		return controllerHelpers.formatApiResponse(401, res, new Error('[[error:not-logged-in]]'));
	}

	const file = req.files && req.files[0];
	if (!file) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:upload.error_file]]'));
	}

	const { note } = req.body;
	if (!note) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:view.new_version_note]]'));
	}

	const doc = await documents.getByDocId(req.params.docId);
	if (!doc || !doc.docId) {
		return controllerHelpers.formatApiResponse(404, res, new Error('[[error:not-found]]'));
	}

	// Validate extension
	const settings = await getSettings();
	const allowedExts = settings.allowedExtensions.split(',').map(e => e.trim().toLowerCase());
	const fileExt = path.extname(file.originalname).replace('.', '').toLowerCase();
	if (!allowedExts.includes(fileExt)) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-documents:upload.error_extension]]'));
	}

	const savedFile = await storage.save({
		name: `${Date.now()}-${file.originalname}`,
		path: file.path,
	});

	const versionData = {
		fileUrl: savedFile.url,
		filePath: savedFile.path,
		fileName: file.originalname,
		fileSize: file.size,
		note: note,
		uid: req.uid,
	};

	await documents.addVersion(req.params.docId, versionData);
	return controllerHelpers.formatApiResponse(200, res, { docId: req.params.docId });
};

controllers.admin = async function (req, res) {
	const settings = await getSettings();
	const autoApproved = settings.autoApproveCategories ? settings.autoApproveCategories.split(',').map(c => c.trim()) : [];
	const categoryOptions = DOC_CATEGORIES.map(c => ({
		value: c,
		label: `[[cop-documents:doc_category.${c}]]`,
		checked: autoApproved.includes(c),
	}));
	res.render('admin/plugins/cop-documents', {
		title: '[[cop-documents:admin.title]]',
		settings: settings,
		categoryOptions: categoryOptions,
	});
};

controllers.saveSettings = async function (req, res) {
	const {
		maxFileSize, allowedExtensions, autoApproveCategories,
		r2AccountId, r2AccessKeyId, r2SecretAccessKey, r2Bucket, r2PublicUrl,
	} = req.body;
	await meta.settings.set('cop-documents', {
		maxFileSize: String(maxFileSize || '20'),
		allowedExtensions: allowedExtensions || 'pdf,docx,xlsx,pptx,jpg,png',
		autoApproveCategories: autoApproveCategories || '',
		r2AccountId: r2AccountId || '',
		r2AccessKeyId: r2AccessKeyId || '',
		r2SecretAccessKey: r2SecretAccessKey || '',
		r2Bucket: r2Bucket || '',
		r2PublicUrl: r2PublicUrl || '',
	});
	return controllerHelpers.formatApiResponse(200, res, { success: true });
};
