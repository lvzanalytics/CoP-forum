'use strict';

const controllers = require('./lib/controllers');

const library = module.exports;

library.init = async function (params) {
	const { router, middleware } = params;
	const routeHelpers = require.main.require('./src/routes/helpers');

	// Page routes (static paths BEFORE parameterized)
	routeHelpers.setupPageRoute(router, '/events', [], controllers.list);
	routeHelpers.setupPageRoute(router, '/events/calendar', [], controllers.calendar);
	routeHelpers.setupPageRoute(router, '/events/create', [middleware.ensureLoggedIn], controllers.create);
	routeHelpers.setupPageRoute(router, '/events/:slug/edit', [middleware.ensureLoggedIn], controllers.edit);
	routeHelpers.setupPageRoute(router, '/events/:slug', [], controllers.view);

	// API routes
	routeHelpers.setupApiRoute(router, 'post', '/api/v3/plugins/cop-events', [middleware.ensureLoggedIn], controllers.handleCreate);
	routeHelpers.setupApiRoute(router, 'put', '/api/v3/plugins/cop-events/:eventId', [middleware.ensureLoggedIn], controllers.handleUpdate);
	routeHelpers.setupApiRoute(router, 'delete', '/api/v3/plugins/cop-events/:eventId', [middleware.ensureLoggedIn], controllers.handleDelete);
	routeHelpers.setupApiRoute(router, 'post', '/api/v3/plugins/cop-events/:eventId/rsvp', [middleware.ensureLoggedIn], controllers.handleRsvp);
	routeHelpers.setupApiRoute(router, 'get', '/api/v3/plugins/cop-events/calendar', [], controllers.apiCalendar);

	// Admin routes
	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/cop-events', [], controllers.admin);
	routeHelpers.setupApiRoute(router, 'put', '/api/admin/plugins/cop-events', [middleware.ensureLoggedIn], controllers.saveSettings);
	routeHelpers.setupApiRoute(router, 'post', '/api/admin/plugins/cop-events/backfill', [middleware.ensureLoggedIn], controllers.backfillTopics);
};

library.addAdminNavigation = async function (header) {
	header.plugins.push({
		route: '/plugins/cop-events',
		icon: 'fa-calendar',
		name: '[[cop-events:admin.title]]',
	});
	return header;
};
