'use strict';

const nconf = require.main.require('nconf');
const meta = require.main.require('./src/meta');
const categories = require.main.require('./src/categories');

const library = module.exports;

const defaults = {
	enableQuickReply: 'on',
	enableBreadcrumbs: 'off',
	centerHeaderElements: 'off',
	mobileTopicTeasers: 'off',
	stickyToolbar: 'on',
	topicSidebarTools: 'off',
	topMobilebar: 'off',
	autohideBottombar: 'on',
	chatModals: 'off',
};

library.init = async function (params) {
	const { router, middleware } = params;
	const routeHelpers = require.main.require('./src/routes/helpers');

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/cop-theme', [], async (req, res) => {
		res.render('admin/plugins/cop-theme', { title: 'CoP Theme Settings' });
	});

	if (nconf.get('isPrimary') && process.env.NODE_ENV === 'production') {
		setTimeout(buildSkins, 0);
	}
};

library.onHomepageGet = function (hookData) {
	hookData.res.render('landing', {});
};

library.addHomepageRoute = async function (data) {
	data.routes.push({
		route: 'landing',
		name: '[[themes/cop:homepage.landing]]',
	});
	return data;
};

async function buildSkins() {
	try {
		const plugins = require.main.require('./src/plugins');
		await plugins.prepareForBuild(['client side styles']);
		for (const skin of meta.css.supportedSkins) {
			await meta.css.buildBundle(`client-${skin}`, true);
		}
		require.main.require('./src/meta/minifier').killAll();
	} catch (err) {
		console.error(err.stack);
	}
}

library.addAdminNavigation = async function (header) {
	header.plugins.push({
		route: '/plugins/cop-theme',
		icon: 'fa-paint-brush',
		name: 'CoP Theme',
	});
	return header;
};

library.defineWidgetAreas = async function (areas) {
	const locations = ['header', 'sidebar', 'footer'];
	const templates = [
		'categories.tpl', 'category.tpl', 'topic.tpl', 'users.tpl',
		'unread.tpl', 'recent.tpl', 'popular.tpl', 'top.tpl', 'tags.tpl', 'tag.tpl',
		'login.tpl', 'register.tpl',
	];
	function capitalizeFirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	templates.forEach((template) => {
		locations.forEach((location) => {
			areas.push({
				name: `${capitalizeFirst(template.split('.')[0])} ${capitalizeFirst(location)}`,
				template: template,
				location: location,
			});
		});
	});

	areas = areas.concat([
		{
			name: 'Main post header',
			template: 'topic.tpl',
			location: 'mainpost-header',
		},
		{
			name: 'Main post footer',
			template: 'topic.tpl',
			location: 'mainpost-footer',
		},
		{
			name: 'Brand Header',
			template: 'global',
			location: 'brand-header',
		},
	]);

	return areas;
};

library.getThemeConfig = async function (config) {
	const themeConfig = await meta.settings.get('cop-theme');
	config.theme = { ...defaults, ...themeConfig };
	config.theme.enableQuickReply = config.theme.enableQuickReply === 'on';
	config.theme.enableBreadcrumbs = config.theme.enableBreadcrumbs === 'on';
	config.theme.centerHeaderElements = config.theme.centerHeaderElements === 'on';
	config.theme.mobileTopicTeasers = config.theme.mobileTopicTeasers === 'on';
	config.theme.stickyToolbar = config.theme.stickyToolbar === 'on';
	config.theme.topicSidebarTools = config.theme.topicSidebarTools === 'on';
	config.theme.autohideBottombar = config.theme.autohideBottombar === 'on';
	config.theme.topMobilebar = config.theme.topMobilebar === 'on';
	config.theme.chatModals = config.theme.chatModals === 'on';
	config.openDraftsOnPageLoad = false;
	return config;
};

library.filterMiddlewareRenderHeader = async function (hookData) {
	// Fetch all categories for the Espaces navbar dropdown
	const allCategories = await categories.getAllCategories(hookData.req.uid || 0);
	hookData.templateData.allCategories = allCategories.filter(c => c && !c.disabled && !c.parentCid);
	hookData.templateData.bootswatchSkinOptions = await meta.css.getSkinSwitcherOptions(hookData.req.uid);

	return hookData;
};
