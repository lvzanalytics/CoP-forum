'use strict';

const directory = require('./directory');
const controllerHelpers = require.main.require('./src/controllers/helpers');
const meta = require.main.require('./src/meta');

const controllers = module.exports;

controllers.directory = async function (req, res) {
	const settings = await directory.getSettings();
	const page = parseInt(req.query.page, 10) || 1;
	const sort = req.query.sort || settings.defaultSort;
	const callerUid = req.uid || 0;

	const searchParams = {
		callerUid,
		expertise: req.query.expertise || '',
		region: req.query.region || '',
		org_type: req.query.org_type || '',
		q: req.query.q || '',
		sort,
		page,
		resultsPerPage: settings.resultsPerPage,
	};

	const [results, filterOptions, optedOut] = await Promise.all([
		directory.search(searchParams),
		directory.getFilterOptions(),
		callerUid > 0 ? directory.isOptedOut(callerUid) : false,
	]);

	const makeOptions = (options, selected) => options.map(opt => ({
		value: opt,
		selected: opt === selected,
	}));

	const data = {
		title: '[[cop-directory:directory.title]]',
		members: results.members,
		total: results.total,
		pagination: results.pagination,
		expertiseOptions: makeOptions(filterOptions.expertiseOptions, searchParams.expertise),
		regionOptions: makeOptions(filterOptions.regionOptions, searchParams.region),
		orgTypeOptions: makeOptions(filterOptions.orgTypeOptions, searchParams.org_type),
		filters: {
			q: searchParams.q,
			expertise: searchParams.expertise,
			region: searchParams.region,
			org_type: searchParams.org_type,
			sort,
		},
		loggedIn: callerUid > 0,
		optedOut,
		enableOptOut: settings.enableOptOut,
	};

	res.render('directory', data);
};

controllers.search = async function (req, res) {
	const settings = await directory.getSettings();
	const page = parseInt(req.query.page, 10) || 1;
	const callerUid = req.uid || 0;

	const searchParams = {
		callerUid,
		expertise: req.query.expertise || '',
		region: req.query.region || '',
		org_type: req.query.org_type || '',
		q: req.query.q || '',
		sort: req.query.sort || settings.defaultSort,
		page,
		resultsPerPage: settings.resultsPerPage,
	};

	const results = await directory.search(searchParams);

	controllerHelpers.formatApiResponse(200, res, {
		members: results.members,
		total: results.total,
		pagination: results.pagination,
	});
};

controllers.optOut = async function (req, res) {
	const uid = req.uid;
	if (!uid || parseInt(uid, 10) <= 0) {
		return controllerHelpers.formatApiResponse(401, res, new Error('[[error:not-logged-in]]'));
	}

	const optedOut = await directory.toggleOptOut(uid);

	controllerHelpers.formatApiResponse(200, res, { optedOut });
};

controllers.admin = async function (req, res) {
	const settings = await directory.getSettings();

	res.render('admin/plugins/cop-directory', {
		title: '[[cop-directory:admin.title]]',
		settings,
	});
};

controllers.saveSettings = async function (req, res) {
	const { resultsPerPage, defaultSort, enableOptOut } = req.body;

	await meta.settings.setOne('cop-directory', 'resultsPerPage', String(parseInt(resultsPerPage, 10) || 20));
	await meta.settings.setOne('cop-directory', 'defaultSort', defaultSort === 'newest' ? 'newest' : 'name');
	await meta.settings.setOne('cop-directory', 'enableOptOut', enableOptOut === '1' ? '1' : '0');

	controllerHelpers.formatApiResponse(200, res, { success: true });
};
