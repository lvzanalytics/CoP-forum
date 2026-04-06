'use strict';

const controllers = require('./lib/controllers');

const library = module.exports;

library.init = async function (params) {
	const { router, middleware } = params;
	const routeHelpers = require.main.require('./src/routes/helpers');

	// Page routes
	routeHelpers.setupPageRoute(router, '/documents', [], controllers.list);
	routeHelpers.setupPageRoute(router, '/documents/upload', [middleware.ensureLoggedIn], controllers.upload);
	routeHelpers.setupPageRoute(router, '/documents/pending', [middleware.ensureLoggedIn], controllers.pending);
	routeHelpers.setupPageRoute(router, '/documents/:docId(\\d+)/:slug?', [], controllers.view);

	// API routes
	routeHelpers.setupApiRoute(router, 'post', '/api/v3/plugins/cop-documents/upload', [middleware.ensureLoggedIn], controllers.handleUpload);
	routeHelpers.setupApiRoute(router, 'get', '/api/v3/plugins/cop-documents/:docId/download', [], controllers.handleDownload);
	routeHelpers.setupApiRoute(router, 'post', '/api/v3/plugins/cop-documents/:docId/approve', [middleware.ensureLoggedIn], controllers.handleApprove);
	routeHelpers.setupApiRoute(router, 'post', '/api/v3/plugins/cop-documents/:docId/reject', [middleware.ensureLoggedIn], controllers.handleReject);
	routeHelpers.setupApiRoute(router, 'put', '/api/v3/plugins/cop-documents/:docId', [middleware.ensureLoggedIn], controllers.handleUpdate);
	routeHelpers.setupApiRoute(router, 'delete', '/api/v3/plugins/cop-documents/:docId', [middleware.ensureLoggedIn], controllers.handleDelete);
	routeHelpers.setupApiRoute(router, 'post', '/api/v3/plugins/cop-documents/:docId/version', [middleware.ensureLoggedIn], controllers.handleVersionUpload);

	// Admin routes
	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/cop-documents', [], controllers.admin);
	routeHelpers.setupApiRoute(router, 'put', '/api/admin/plugins/cop-documents', [middleware.ensureLoggedIn], controllers.saveSettings);
};

library.addAdminNavigation = async function (header) {
	header.plugins.push({
		route: '/plugins/cop-documents',
		icon: 'fa-file-text',
		name: '[[cop-documents:admin.title]]',
	});
	return header;
};
