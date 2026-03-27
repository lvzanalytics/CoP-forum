'use strict';

const db = require.main.require('./src/database');
const User = require.main.require('./src/user');
const privileges = require.main.require('./src/privileges');
const meta = require.main.require('./src/meta');
const pagination = require.main.require('./src/pagination');

const directory = module.exports;

const USER_FIELDS = [
	'uid', 'username', 'userslug', 'fullname', 'picture',
	'icon:text', 'icon:bgColor', 'status', 'banned', 'joindate',
	'fullname_org', 'title_role', 'org_type', 'expertise',
	'region', 'bio_pro', 'reputation',
];

directory.search = async function (params) {
	const {
		callerUid,
		expertise,
		region,
		org_type: orgType,
		q,
		sort,
		page,
		resultsPerPage,
	} = params;

	// 1. Get all user UIDs
	const uids = await db.getSortedSetRevRange('users:joindate', 0, -1);
	if (!uids.length) {
		return buildEmptyResult(page, {});
	}

	// 2. Filter out opted-out users
	const optedOutFlags = await db.isSetMembers('directory:opted-out', uids);
	const visibleUids = uids.filter((uid, i) => !optedOutFlags[i]);

	if (!visibleUids.length) {
		return buildEmptyResult(page, {});
	}

	// 3. Fetch user data including custom fields
	let users = await User.getUsersFields(visibleUids, USER_FIELDS);

	// 4. Filter out uid 0 and banned users
	users = users.filter(u => u && u.uid > 0 && !u.banned);

	// 5. Apply field visibility checks
	users = await applyVisibility(callerUid, users);

	// 6. Apply filters
	if (expertise) {
		users = users.filter((u) => {
			if (!u.expertise) {
				return false;
			}
			try {
				const values = JSON.parse(u.expertise);
				return Array.isArray(values) && values.includes(expertise);
			} catch {
				return u.expertise === expertise;
			}
		});
	}

	if (region) {
		users = users.filter(u => u.region === region);
	}

	if (orgType) {
		users = users.filter(u => u.org_type === orgType);
	}

	if (q) {
		const query = q.toLowerCase();
		users = users.filter((u) => {
			const searchable = [
				u.username, u.fullname, u.fullname_org,
				u.title_role, u.bio_pro,
			].filter(Boolean).join(' ').toLowerCase();
			return searchable.includes(query);
		});
	}

	// 7. Sort
	if (sort === 'newest') {
		users.sort((a, b) => (b.joindate || 0) - (a.joindate || 0));
	} else {
		// Default: sort by name (fullname or username)
		users.sort((a, b) => {
			const nameA = (a.fullname || a.username || '').toLowerCase();
			const nameB = (b.fullname || b.username || '').toLowerCase();
			return nameA.localeCompare(nameB);
		});
	}

	const total = users.length;

	// 8. Build query object for pagination links
	const queryObj = {};
	if (q) { queryObj.q = q; }
	if (expertise) { queryObj.expertise = expertise; }
	if (region) { queryObj.region = region; }
	if (orgType) { queryObj.org_type = orgType; }
	if (sort) { queryObj.sort = sort; }

	// 9. Paginate
	const pageCount = Math.max(1, Math.ceil(total / resultsPerPage));
	const currentPage = Math.max(1, Math.min(page, pageCount));
	const start = (currentPage - 1) * resultsPerPage;
	const members = users.slice(start, start + resultsPerPage);

	// Parse expertise arrays for display
	members.forEach((m) => {
		if (m.expertise) {
			try {
				const parsed = JSON.parse(m.expertise);
				m.expertiseList = Array.isArray(parsed) ? parsed : [m.expertise];
			} catch {
				m.expertiseList = [m.expertise];
			}
		} else {
			m.expertiseList = [];
		}
	});

	return {
		members,
		total,
		pagination: pagination.create(currentPage, pageCount, queryObj),
	};
};

directory.getFilterOptions = async function () {
	const keys = await db.getSortedSetRange('user-custom-fields', 0, -1);
	if (!keys.length) {
		return { expertiseOptions: [], regionOptions: [], orgTypeOptions: [] };
	}

	const fields = (await db.getObjects(keys.map(k => `user-custom-field:${k}`))).filter(Boolean);

	const expertiseField = fields.find(f => f.key === 'expertise');
	const regionField = fields.find(f => f.key === 'region');
	const orgTypeField = fields.find(f => f.key === 'org_type');

	const parseOptions = (field) => {
		if (!field || !field['select-options']) {
			return [];
		}
		return field['select-options'].split('\n').filter(Boolean);
	};

	return {
		expertiseOptions: parseOptions(expertiseField),
		regionOptions: parseOptions(regionField),
		orgTypeOptions: parseOptions(orgTypeField),
	};
};

directory.isOptedOut = async function (uid) {
	if (!uid || parseInt(uid, 10) <= 0) {
		return false;
	}
	return await db.isSetMember('directory:opted-out', uid);
};

directory.toggleOptOut = async function (uid) {
	const isCurrentlyOptedOut = await directory.isOptedOut(uid);
	if (isCurrentlyOptedOut) {
		await db.setRemove('directory:opted-out', uid);
	} else {
		await db.setAdd('directory:opted-out', uid);
	}
	return !isCurrentlyOptedOut;
};

directory.getSettings = async function () {
	return {
		resultsPerPage: parseInt(await meta.settings.getOne('cop-directory', 'resultsPerPage'), 10) || 20,
		defaultSort: await meta.settings.getOne('cop-directory', 'defaultSort') || 'name',
		enableOptOut: (await meta.settings.getOne('cop-directory', 'enableOptOut')) !== '0',
	};
};

async function applyVisibility(callerUid, users) {
	const keys = await db.getSortedSetRange('user-custom-fields', 0, -1);
	if (!keys.length) {
		return users;
	}

	const allFields = (await db.getObjects(keys.map(k => `user-custom-field:${k}`))).filter(Boolean);
	const customFieldKeys = allFields.map(f => f.key);

	const [isAdmin, isModOfAny] = await Promise.all([
		privileges.users.isAdministrator(callerUid),
		callerUid > 0 ? User.isModeratorOfAnyCategory(callerUid) : false,
	]);

	return users.map((userData) => {
		const filtered = { ...userData };
		allFields.forEach((field) => {
			if (!customFieldKeys.includes(field.key)) {
				return;
			}
			const visibility = field.visibility || 'all';
			const isSelf = String(callerUid) === String(userData.uid);
			const visibilityCheck = isAdmin || isModOfAny || isSelf || visibility === 'all' ||
				(
					visibility === 'loggedin' &&
					String(callerUid) !== '0' &&
					String(callerUid) !== '-1'
				);
			if (!visibilityCheck) {
				delete filtered[field.key];
			}
		});
		return filtered;
	});
}

function buildEmptyResult(page, queryObj) {
	return {
		members: [],
		total: 0,
		pagination: pagination.create(1, 1, queryObj),
	};
}
