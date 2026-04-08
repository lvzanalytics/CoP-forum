'use strict';

const controllers = require('./lib/controllers');
const events = require('./lib/events');

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

library.addSectorLabels = async function (data) {
	const { topics } = data;
	if (!topics || !topics.length) return data;

	const tids = topics.map(t => t && t.tid).filter(Boolean);
	const eventsData = await events.getByTids(tids);

	const eventsByTid = {};
	for (let i = 0; i < tids.length; i++) {
		if (eventsData[i] && eventsData[i].sector) {
			eventsByTid[tids[i]] = eventsData[i];
		}
	}

	topics.forEach((topic) => {
		if (!topic || !topic.tid) return;
		const ev = eventsByTid[topic.tid];
		if (ev && ev.sector) {
			topic.icons = topic.icons || [];
			topic.icons.push(`<span class="badge border border-gray-300 text-body"><i class="fa fa-tag"></i> <span>${ev.sector}</span></span>`);
		}
	});

	return data;
};

library.addSectorLabelSingle = async function (data) {
	const { topic } = data;
	if (!topic || !topic.tid) return data;

	const ev = await events.getByTid(topic.tid);
	if (ev && ev.sector) {
		topic.icons = topic.icons || [];
		topic.icons.push(`<span class="badge border border-gray-300 text-body"><i class="fa fa-tag"></i> <span>${ev.sector}</span></span>`);
	}

	return data;
};

library.addAdminNavigation = async function (header) {
	header.plugins.push({
		route: '/plugins/cop-events',
		icon: 'fa-calendar',
		name: '[[cop-events:admin.title]]',
	});
	return header;
};
