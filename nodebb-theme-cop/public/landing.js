'use strict';

/* globals document, window, $ */

$(document).ready(function () {
	function initLandingAnimations() {
		const landing = document.querySelector('#landing-page');
		if (!landing) return;

		// --- Hero entrance (immediate, no scroll needed) ---
		const heroEls = landing.querySelectorAll('.landing-hero .hero-content > *');
		heroEls.forEach(function (el, i) {
			el.style.opacity = '0';
			el.style.transform = 'translateY(30px)';
			el.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)';
			el.style.transitionDelay = (i * 0.15) + 's';
			requestAnimationFrame(function () {
				requestAnimationFrame(function () {
					el.style.opacity = '1';
					el.style.transform = 'translateY(0)';
				});
			});
		});

		// --- Scroll-triggered reveals via IntersectionObserver ---
		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('cop-visible');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

		// Fade-up for sections
		var sections = landing.querySelectorAll('.landing-overview, .landing-pillars, .landing-roles, .landing-cta, .landing-partners, .landing-prefooter');
		sections.forEach(function (section) {
			section.classList.add('cop-reveal');
			observer.observe(section);
		});

		// Stagger children: bento cards
		var bentoCards = landing.querySelectorAll('.bento-card');
		bentoCards.forEach(function (card, i) {
			card.classList.add('cop-reveal', 'cop-reveal--stagger');
			card.style.transitionDelay = (i * 0.12) + 's';
			observer.observe(card);
		});

		// Stagger children: role cards
		var roleCards = landing.querySelectorAll('.role-card');
		roleCards.forEach(function (card, i) {
			card.classList.add('cop-reveal', 'cop-reveal--stagger');
			card.style.transitionDelay = (i * 0.1) + 's';
			observer.observe(card);
		});

		// Stagger children: partner cards
		var partnerCards = landing.querySelectorAll('.partner-card');
		partnerCards.forEach(function (card, i) {
			card.classList.add('cop-reveal', 'cop-reveal--stagger');
			card.style.transitionDelay = (i * 0.1) + 's';
			observer.observe(card);
		});

		// Pillar rows — slide in from sides
		var pillarRows = landing.querySelectorAll('.pillar-row');
		pillarRows.forEach(function (row) {
			var content = row.querySelector('.pillar-text');
			var visual = row.querySelector('.pillar-visual');
			if (content) {
				content.classList.add('cop-reveal', 'cop-reveal--slide-left');
				observer.observe(content);
			}
			if (visual) {
				visual.classList.add('cop-reveal', 'cop-reveal--slide-right');
				observer.observe(visual);
			}
		});

		// CTA box — scale up
		var ctaBox = landing.querySelector('.cta-box');
		if (ctaBox) {
			ctaBox.classList.add('cop-reveal', 'cop-reveal--scale');
			observer.observe(ctaBox);
		}

		// Pillar images
		var pillarImages = landing.querySelectorAll('.pillar-image');
		pillarImages.forEach(function (img) {
			img.classList.add('cop-reveal', 'cop-reveal--scale');
			observer.observe(img);
		});

		// Visual mockups
		var mockups = landing.querySelectorAll('.visual-mockup');
		mockups.forEach(function (m) {
			m.classList.add('cop-reveal', 'cop-reveal--scale');
			observer.observe(m);
		});
	}

	// Initialize
	initLandingAnimations();

	// Handle Ajaxify Navigation
	$(window).on('action:ajaxify.end', function () {
		initLandingAnimations();
	});
});
