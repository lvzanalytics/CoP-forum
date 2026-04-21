'use strict';

const db = require.main.require('./src/database');
const plugins = require.main.require('./src/plugins');
const User = require.main.require('./src/user');
const slugify = require.main.require('./src/slugify');

const documents = module.exports;

documents.create = async function (data) {
	const docId = await db.incrObjectField('global', 'nextDocId');
	const slug = slugify(data.title) || 'document';
	const now = Date.now();

	const docData = {
		docId: docId,
		title: data.title,
		slug: slug,
		author: data.author,
		date: data.date,
		description: data.description,
		category: data.category,
		tags: data.tags,
		region: data.region || '',
		sector: data.sector || '',
		sourceOrg: data.sourceOrg || '',
		pubDate: data.pubDate || '',
		language: data.language || 'fr',
		access: data.access,
		fileUrl: data.fileUrl,
		filePath: data.filePath || '',
		fileName: data.fileName,
		fileSize: data.fileSize,
		fileExt: data.fileExt,
		uid: data.uid,
		status: data.status || 'pending',
		downloads: 0,
		currentVersion: 1,
		createdAt: now,
		updatedAt: now,
	};

	if (data.status === 'approved') {
		docData.approvedBy = data.uid;
		docData.approvedAt = now;
	}

	await db.setObject(`document:${docId}`, docData);

	if (data.status === 'approved') {
		await db.sortedSetAdd('documents:approved', now, docId);
	} else {
		await db.sortedSetAdd('documents:pending', now, docId);
	}

	// Index by category
	await db.sortedSetAdd(`documents:category:${data.category}`, now, docId);

	// Index by uploader
	await db.sortedSetAdd(`uid:${data.uid}:documents`, now, docId);

	// Downloads sorted set (start at 0)
	await db.sortedSetAdd('documents:downloads', 0, docId);

	// Add tags to global tag set
	if (data.tags) {
		const tagList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
		for (const tag of tagList) {
			await db.sortedSetAdd('documents:tags', 0, tag.toLowerCase());
			await db.sortedSetAdd(`documents:tag:${tag.toLowerCase()}`, now, docId);
		}
	}

	return docData;
};

documents.getByDocId = async function (docId) {
	const doc = await db.getObject(`document:${docId}`);
	if (!doc) {
		return null;
	}
	// Attach user data
	if (doc.uid) {
		const userData = await User.getUserFields(doc.uid, ['username', 'userslug', 'picture']);
		doc.user = userData;
	}
	return doc;
};

documents.getApproved = async function (filters, page, perPage, visibleAccess) {
	let docIds;
	const start = (page - 1) * perPage;
	const stop = start + perPage - 1;

	// Determine which sorted set to query based on filters
	if (filters.category) {
		docIds = await db.getSortedSetRevRange(`documents:category:${filters.category}`, 0, -1);
		// Filter to only approved
		const approvedIds = await db.isSortedSetMembers('documents:approved', docIds);
		docIds = docIds.filter((id, idx) => approvedIds[idx]);
	} else if (filters.tag) {
		docIds = await db.getSortedSetRevRange(`documents:tag:${filters.tag.toLowerCase()}`, 0, -1);
		const approvedIds = await db.isSortedSetMembers('documents:approved', docIds);
		docIds = docIds.filter((id, idx) => approvedIds[idx]);
	} else if (filters.sort === 'popular') {
		docIds = await db.getSortedSetRevRange('documents:downloads', 0, -1);
		const approvedIds = await db.isSortedSetMembers('documents:approved', docIds);
		docIds = docIds.filter((id, idx) => approvedIds[idx]);
	} else if (filters.sort === 'oldest') {
		docIds = await db.getSortedSetRange('documents:approved', 0, -1);
	} else {
		// Default: newest
		docIds = await db.getSortedSetRevRange('documents:approved', 0, -1);
	}

	// Fetch all candidate docs, then filter by access + text search
	const docs = await getDocuments(docIds);
	const filtered = docs.filter((doc) => {
		if (!doc) return false;
		// Access level filter — hide docs the user cannot see
		if (visibleAccess && !visibleAccess.includes(doc.access || 'public')) return false;
		// Text search filters
		if (filters.q) {
			const q = filters.q.toLowerCase();
			const matchTitle = doc.title && doc.title.toLowerCase().includes(q);
			const matchDesc = doc.description && doc.description.toLowerCase().includes(q);
			const matchAuthor = doc.author && doc.author.toLowerCase().includes(q);
			if (!matchTitle && !matchDesc && !matchAuthor) return false;
		}
		if (filters.region && doc.region !== filters.region) return false;
		if (filters.sector && doc.sector && !doc.sector.toLowerCase().includes(filters.sector.toLowerCase())) return false;
		return true;
	});
	const total = filtered.length;
	const paged = filtered.slice(start, stop + 1);
	return { docs: paged, total: total };
};

async function getDocuments(docIds) {
	if (!docIds.length) return [];
	const keys = docIds.map(id => `document:${id}`);
	const docs = await db.getObjects(keys);

	// Attach user data
	const uids = docs.filter(Boolean).map(d => d.uid);
	const uniqueUids = [...new Set(uids)];
	const usersData = await User.getUsersFields(uniqueUids, ['uid', 'username', 'userslug', 'picture']);
	const userMap = {};
	usersData.forEach((u) => {
		if (u && u.uid) userMap[u.uid] = u;
	});

	docs.forEach((doc) => {
		if (doc && doc.uid) {
			doc.user = userMap[doc.uid] || {};
		}
		if (doc && doc.tags && typeof doc.tags === 'string') {
			doc.tagsArray = doc.tags.split(',').map(t => t.trim()).filter(Boolean);
		}
		if (doc && doc.category) {
			doc.categoryLabel = `[[cop-documents:doc_category.${doc.category}]]`;
		}
		if (doc) {
			doc.aiSummary = doc['ai:summary'] || null;
		}
	});

	return docs;
}

documents.getByUid = async function (uid) {
	const docIds = await db.getSortedSetRevRange(`uid:${uid}:documents`, 0, -1);
	if (!docIds.length) return [];
	const keys = docIds.map(id => `document:${id}`);
	const docs = await db.getObjects(keys);

	const usersData = await User.getUsersFields([uid], ['uid', 'username', 'userslug', 'picture']);
	const userData = usersData[0] || {};

	return docs.filter(Boolean).map((doc) => {
		doc.user = userData;
		if (doc.tags && typeof doc.tags === 'string') {
			doc.tagsArray = doc.tags.split(',').map(t => t.trim()).filter(Boolean);
		}
		if (doc.category) {
			doc.categoryLabel = `[[cop-documents:doc_category.${doc.category}]]`;
		}
		doc.statusLabel = `[[cop-documents:view.status_${doc.status || 'pending'}]]`;
		doc.aiSummary = doc['ai:summary'] || null;
		return doc;
	});
};

documents.getPending = async function () {
	const docIds = await db.getSortedSetRevRange('documents:pending', 0, -1);
	return getDocuments(docIds);
};

documents.approve = async function (docId, adminUid) {
	const now = Date.now();
	await db.setObjectField(`document:${docId}`, 'status', 'approved');
	await db.setObjectField(`document:${docId}`, 'approvedBy', adminUid);
	await db.setObjectField(`document:${docId}`, 'approvedAt', now);
	await db.setObjectField(`document:${docId}`, 'updatedAt', now);

	// Move from pending to approved
	await db.sortedSetRemove('documents:pending', docId);
	await db.sortedSetAdd('documents:approved', now, docId);

	plugins.hooks.fire('action:cop-documents.approved', { docId, uid: adminUid });
};

documents.reject = async function (docId, adminUid, reason) {
	const now = Date.now();
	await db.setObjectField(`document:${docId}`, 'status', 'rejected');
	await db.setObjectField(`document:${docId}`, 'rejectedBy', adminUid);
	await db.setObjectField(`document:${docId}`, 'rejectedAt', now);
	await db.setObjectField(`document:${docId}`, 'rejectReason', reason);
	await db.setObjectField(`document:${docId}`, 'updatedAt', now);

	await db.sortedSetRemove('documents:pending', docId);
};

documents.remove = async function (docId) {
	const doc = await db.getObject(`document:${docId}`);
	if (!doc) return;

	await db.sortedSetRemove('documents:approved', docId);
	await db.sortedSetRemove('documents:pending', docId);
	await db.sortedSetRemove('documents:downloads', docId);

	if (doc.category) {
		await db.sortedSetRemove(`documents:category:${doc.category}`, docId);
	}
	if (doc.uid) {
		await db.sortedSetRemove(`uid:${doc.uid}:documents`, docId);
	}
	if (doc.tags) {
		const tagList = doc.tags.split(',').map(t => t.trim()).filter(Boolean);
		for (const tag of tagList) {
			await db.sortedSetRemove(`documents:tag:${tag.toLowerCase()}`, docId);
		}
	}

	// Remove version data
	const versionIds = await db.getSortedSetRange(`document:${docId}:versions`, 0, -1);
	for (const vid of versionIds) {
		await db.delete(`document:${docId}:version:${vid}`);
	}
	await db.delete(`document:${docId}:versions`);

	await db.delete(`document:${docId}`);
};

documents.update = async function (docId, data) {
	const doc = await db.getObject(`document:${docId}`);
	if (!doc) return null;

	const now = Date.now();
	const newSlug = slugify(data.title) || 'document';

	const updates = {
		title: data.title,
		slug: newSlug,
		author: data.author,
		date: data.date,
		description: data.description,
		category: data.category,
		tags: data.tags,
		region: data.region || '',
		sector: data.sector || '',
		sourceOrg: data.sourceOrg || '',
		pubDate: data.pubDate || '',
		language: data.language || 'fr',
		access: data.access,
		updatedAt: now,
	};

	await db.setObject(`document:${docId}`, updates);

	// Re-index category if changed
	if (doc.category !== data.category) {
		await db.sortedSetRemove(`documents:category:${doc.category}`, docId);
		const score = doc.createdAt || now;
		await db.sortedSetAdd(`documents:category:${data.category}`, score, docId);
	}

	// Re-index tags if changed
	if (doc.tags !== data.tags) {
		// Remove old tags
		if (doc.tags) {
			const oldTags = doc.tags.split(',').map(t => t.trim()).filter(Boolean);
			for (const tag of oldTags) {
				await db.sortedSetRemove(`documents:tag:${tag.toLowerCase()}`, docId);
			}
		}
		// Add new tags
		if (data.tags) {
			const newTags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
			const score = doc.createdAt || now;
			for (const tag of newTags) {
				await db.sortedSetAdd('documents:tags', 0, tag.toLowerCase());
				await db.sortedSetAdd(`documents:tag:${tag.toLowerCase()}`, score, docId);
			}
		}
	}

	return { ...doc, ...updates };
};

documents.incrementDownloads = async function (docId) {
	const newCount = await db.incrObjectField(`document:${docId}`, 'downloads');
	await db.sortedSetAdd('documents:downloads', newCount, docId);
};

documents.addVersion = async function (docId, versionData) {
	const doc = await db.getObject(`document:${docId}`);
	if (!doc) return;

	const versionNum = (parseInt(doc.currentVersion, 10) || 1) + 1;
	const now = Date.now();

	const version = {
		version: versionNum,
		fileUrl: versionData.fileUrl,
		filePath: versionData.filePath || '',
		fileName: versionData.fileName,
		fileSize: versionData.fileSize,
		note: versionData.note,
		uid: versionData.uid,
		createdAt: now,
	};

	await db.setObject(`document:${docId}:version:${versionNum}`, version);
	await db.sortedSetAdd(`document:${docId}:versions`, now, versionNum);

	// Update document with new version info
	await db.setObjectField(`document:${docId}`, 'currentVersion', versionNum);
	await db.setObjectField(`document:${docId}`, 'fileUrl', versionData.fileUrl);
	await db.setObjectField(`document:${docId}`, 'filePath', versionData.filePath || '');
	await db.setObjectField(`document:${docId}`, 'fileName', versionData.fileName);
	await db.setObjectField(`document:${docId}`, 'fileSize', versionData.fileSize);
	await db.setObjectField(`document:${docId}`, 'updatedAt', now);

	// Attach user data to version
	if (versionData.uid) {
		const userData = await User.getUserFields(versionData.uid, ['username', 'userslug']);
		version.user = userData;
	}

	plugins.hooks.fire('action:cop-documents.versionUploaded', { docId });

	return version;
};

documents.getVersions = async function (docId) {
	const versionNums = await db.getSortedSetRevRange(`document:${docId}:versions`, 0, -1);
	if (!versionNums.length) return [];

	const versions = [];
	for (const num of versionNums) {
		const v = await db.getObject(`document:${docId}:version:${num}`);
		if (v) {
			if (v.uid) {
				const userData = await User.getUserFields(v.uid, ['username', 'userslug']);
				v.user = userData;
			}
			versions.push(v);
		}
	}
	return versions;
};
