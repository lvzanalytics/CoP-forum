'use strict';

$(document).ready(function () {
	setupNavbar();
	setupMobileMenu();
	setupActiveNavLink();
	setupNProgress();

	// Chat modal control
	require(['hooks'], function (hooks) {
		hooks.on('filter:chat.openChat', function (hookData) {
			hookData.modal = config.theme.chatModals && !utils.isMobile();
			return hookData;
		});
	});

	// Frosted glass navbar on scroll
	function setupNavbar() {
		var navbar = document.getElementById('cop-navbar');
		if (!navbar) return;

		function onScroll() {
			if (window.scrollY > 10) {
				navbar.classList.add('cop-navbar--scrolled');
			} else {
				navbar.classList.remove('cop-navbar--scrolled');
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
	}

	// Mobile drawer toggle
	function setupMobileMenu() {
		var toggle = $('#cop-mobile-toggle');
		var drawer = $('#cop-mobile-drawer');
		var overlay = $('#cop-drawer-overlay');

		function openDrawer() {
			drawer.addClass('open');
			overlay.addClass('active');
		}

		function closeDrawer() {
			drawer.removeClass('open');
			overlay.removeClass('active');
		}

		toggle.on('click', function () {
			if (drawer.hasClass('open')) {
				closeDrawer();
			} else {
				openDrawer();
			}
		});

		overlay.on('click', closeDrawer);

		// Close on navigation
		$(window).on('action:ajaxify.start', closeDrawer);
	}

	// Highlight active nav link
	function setupActiveNavLink() {
		function highlight() {
			var path = window.location.pathname;
			$('.cop-nav-link').removeClass('active');
			$('.cop-drawer-nav a, .cop-drawer-categories a').removeClass('active');

			$('.cop-nav-link[data-path]').each(function () {
				var linkPath = $(this).data('path');
				if (linkPath === '/' && (path === '/' || path === '' || path === '/categories')) {
					$(this).addClass('active');
				} else if (linkPath !== '/' && path.startsWith(linkPath)) {
					$(this).addClass('active');
				}
			});

			// Also check if we're on a category page — highlight "Espaces"
			if (path.startsWith('/category/')) {
				$('.cop-espaces-dropdown > .cop-nav-link').addClass('active');
			}
		}

		highlight();
		$(window).on('action:ajaxify.end', highlight);
	}

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
});
