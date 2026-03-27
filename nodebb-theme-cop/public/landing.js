'use strict';

/* globals document, window, gsap, ScrollTrigger, $ */

$(document).ready(function () {
	function initLandingAnimations() {
		const landing = document.querySelector('#landing-page');
		if (!landing || !window.gsap || !window.ScrollTrigger) return;

		gsap.registerPlugin(ScrollTrigger);

		// --- Hero Parallax & Entrance ---
		gsap.from('.landing-hero .hero-content > *', {
			y: 30,
			opacity: 0,
			duration: 1,
			stagger: 0.2,
			ease: 'power3.out'
		});

		gsap.to('.landing-hero::before', {
			scrollTrigger: {
				trigger: '.landing-hero',
				start: 'top top',
				end: 'bottom top',
				scrub: true
			},
			y: 100,
			ease: 'none'
		});

		// --- Section Entrance Reveal ---
		const revealSections = gsap.utils.toArray('section');
		revealSections.forEach((section) => {
			gsap.from(section, {
				scrollTrigger: {
					trigger: section,
					start: 'top 85%',
					toggleActions: 'play none none none'
				},
				opacity: 0,
				y: 30,
				duration: 1,
				ease: 'power2.out'
			});
		});

		// --- Role Cards Stagger ---
		gsap.from('.role-card', {
			scrollTrigger: {
				trigger: '.landing-roles',
				start: 'top 75%'
			},
			y: 40,
			opacity: 0,
			stagger: 0.15,
			duration: 0.8,
			ease: 'back.out(1.7)'
		});

		// --- Pillar Visual Mockups ---
		gsap.from('.visual-mockup', {
			scrollTrigger: {
				trigger: '.landing-pillars',
				start: 'top 70%'
			},
			scale: 0.8,
			opacity: 0,
			duration: 1,
			ease: 'power3.out'
		});

		// --- Bento Grid Stagger ---
		gsap.from('.bento-card', {
			scrollTrigger: {
				trigger: '.bento-grid',
				start: 'top 80%'
			},
			y: 50,
			opacity: 0,
			stagger: 0.2,
			duration: 1,
			ease: 'power3.out'
		});

		// --- CTA Box Reveal ---
		gsap.from('.cta-box', {
			scrollTrigger: {
				trigger: '.landing-cta',
				start: 'top 80%'
			},
			scale: 0.9,
			opacity: 0,
			duration: 1.2,
			ease: 'power4.out'
		});
	}

	// Initialize
	initLandingAnimations();

	// Handle Ajaxify Navigation
	$(window).on('action:ajaxify.end', function () {
		if (window.ScrollTrigger) {
			ScrollTrigger.getAll().forEach(t => t.kill());
		}
		initLandingAnimations();
	});
});
