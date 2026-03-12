'use strict';

$(document).ready(function () {
	setupMobileSidebar();
	setupNProgress();
	setupSidebarHighlight();
	setupComposerResize();
	setupSearch();

	// Mobile sidebar toggle
	function setupMobileSidebar() {
		const sidebar = $('.sidebar-left');
		const overlay = $('#cop-sidebar-overlay');
		const toggle = $('#cop-mobile-toggle');

		function openSidebar() {
			sidebar.addClass('mobile-open');
			overlay.addClass('active');
		}

		function closeSidebar() {
			sidebar.removeClass('mobile-open');
			overlay.removeClass('active');
		}

		toggle.on('click', function () {
			if (sidebar.hasClass('mobile-open')) {
				closeSidebar();
			} else {
				openSidebar();
			}
		});

		overlay.on('click', closeSidebar);

		// Close on navigation
		$(window).on('action:ajaxify.start', closeSidebar);
	}

	// Sidebar toggle (desktop expand/collapse)
	require(['hooks', 'api'], function (hooks, api) {
		$('[component="sidebar/toggle"]').on('click', async function () {
			const sidebarEl = $('.sidebar');
			sidebarEl.toggleClass('open');
			if (app.user.uid) {
				await api.put(`/users/${app.user.uid}/settings`, {
					settings: {
						openSidebars: sidebarEl.hasClass('open') ? 'on' : 'off',
					},
				});
			}
			$(window).trigger('action:sidebar.toggle');
		});

		// Composer width adjustment
		$(window).on('action:composer.resize action:sidebar.toggle', function () {
			const isRtl = $('html').attr('data-dir') === 'rtl';
			const css = {
				width: $('#panel').width(),
			};
			const sidebarEl = $('.sidebar-left');
			css[isRtl ? 'right' : 'left'] = sidebarEl.is(':visible') ? sidebarEl.outerWidth(true) : 0;
			$('[component="composer"]').css(css);
		});

		hooks.on('filter:chat.openChat', function (hookData) {
			hookData.modal = config.theme.chatModals && !utils.isMobile();
			return hookData;
		});
	});

	function setupNProgress() {
		require(['nprogress'], function (NProgress) {
			window.nprogress = NProgress;
			if (NProgress) {
				$(window).on('action:ajaxify.start', function () {
					NProgress.set(0.7);
				});
				$(window).on('action:ajaxify.end', function () {
					NProgress.done(true);
				});
			}
		});
	}

	// Highlight active channel in sidebar
	function setupSidebarHighlight() {
		function highlightCurrent() {
			$('.cop-channel-item a').removeClass('active');
			const currentPath = window.location.pathname;
			$('.cop-channel-item a').each(function () {
				const href = $(this).attr('href');
				if (href && currentPath.startsWith(href) && href !== '/') {
					$(this).addClass('active');
				}
			});
		}

		highlightCurrent();
		$(window).on('action:ajaxify.end', highlightCurrent);
	}

	function setupComposerResize() {
		$(window).on('action:composer.resize', function () {
			const isRtl = $('html').attr('data-dir') === 'rtl';
			const css = {
				width: $('#panel').width(),
			};
			const sidebarEl = $('.sidebar-left');
			css[isRtl ? 'right' : 'left'] = sidebarEl.is(':visible') ? sidebarEl.outerWidth(true) : 0;
			$('[component="composer"]').css(css);
		});
	}

	function setupSearch() {
		$('[component="sidebar/search"]').on('shown.bs.dropdown', function () {
			$(this).find('[component="search/fields"] input[name="query"]').trigger('focus');
		});
	}

	// Tooltip setup
	const tooltipEls = $('.sidebar [title]');
	tooltipEls.tooltip({
		trigger: 'manual',
		animation: false,
		placement: 'right',
	});

	tooltipEls.on('mouseenter', function (ev) {
		const target = $(ev.target);
		const isSidebarOpen = target.parents('.sidebar').hasClass('open');
		if (!isSidebarOpen) {
			$(this).tooltip('show');
		}
	});
	tooltipEls.on('click mouseleave', function () {
		$(this).tooltip('hide');
	});
});
