'use strict';

const controllers = require('./lib/controllers');

const library = module.exports;

library.init = async function (params) {
	const { router, middleware } = params;
	const routeHelpers = require.main.require('./src/routes/helpers');

	// Page routes
	routeHelpers.setupPageRoute(router, '/directory', [], controllers.directory);

	// API routes
	routeHelpers.setupApiRoute(router, 'get', '/api/v3/plugins/cop-directory/search', [], controllers.search);
	routeHelpers.setupApiRoute(router, 'post', '/api/v3/plugins/cop-directory/opt-out', [middleware.ensureLoggedIn], controllers.optOut);

	// Admin routes
	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/cop-directory', [], controllers.admin);
	routeHelpers.setupApiRoute(router, 'put', '/api/admin/plugins/cop-directory/settings', [middleware.ensureLoggedIn], controllers.saveSettings);
};

library.addAdminNavigation = async function (header) {
	header.plugins.push({
		route: '/plugins/cop-directory',
		icon: 'fa-address-book',
		name: '[[cop-directory:admin.title]]',
	});
	return header;
};
