'use strict';

// nodebb-theme-cop : French relabel of hardcoded literal / route-name strings
// that have NO fixable translation key in NodeBB core (cannot be overridden via
// language files without forking core templates/controllers).
//
// This script ONLY rewrites VISIBLE TEXT. It never touches <option> value
// attributes (those are saved config identifiers / route ids). It is fully
// idempotent (guarded by a data-flag) and safe to run on every page load and
// after every ajaxify navigation.
//
// Loaded via:
//   - "acpScripts" (admin js bundle)  -> /admin/* pages, incl. /admin/settings/email
//   - "scripts"    (client js bundle) -> public pages, incl. /user/<name>/settings
(function () {
	// --- Homepage selector (account settings page) -------------------------
	// Hardcoded "None" option in harmony account/settings.tpl, plus the English
	// route names from core src/controllers/helpers.js getHomePageRoutes().
	var HOMEPAGE_ROUTE_LABELS = {
		none: 'Aucune',
		categories: 'Catégories',
		unread: 'Sujets non lus',
		recent: 'Sujets récents',
		top: 'Meilleurs',
		popular: 'Populaires',
		custom: 'Personnalisée',
	};

	// --- Email template path identifiers (admin/settings/email) -------------
	// These paths are used by core as BOTH the option value AND the visible
	// label. We map each known path to a French display label, keeping the
	// value untouched. Applies to #email-editor-selector and the #test-email
	// "sendable" dropdown (which reuses the same paths).
	var EMAIL_PATH_LABELS = {
		banned: 'Bannissement',
		digest: "Lettre d'activités",
		invitation: 'Invitation',
		notification: 'Notification',
		registration_accepted: 'Inscription acceptée',
		reset: 'Réinitialisation du mot de passe',
		reset_notify: 'Notification de réinitialisation du mot de passe',
		test: 'Test',
		'verify-email': "Vérification de l'adresse e-mail",
		welcome: 'Bienvenue',
	};

	// --- Admin sidebar plugin names (left nav, Plugins section) -------------
	// Third-party plugins push hardcoded English literal names into the ACP
	// nav (rendered at src/views/admin/partials/navigation.tpl) with no
	// translation key. Matched by visible text inside #collapsePlugins.
	// Names that are identical in French (Markdown, Mentions, Emoji) are left
	// untouched on purpose.
	var PLUGIN_NAV_LABELS = {
		'Composer (Default)': 'Éditeur (par défaut)',
		'DB Search': 'Recherche en base de données',
		'Push Notifications (via Push API)': 'Notifications push (via Push API)',
		'S3 Uploads': 'Téléversements S3',
	};

	function relabelByText(container, map) {
		if (!container) {
			return;
		}
		var links = container.getElementsByTagName('a');
		for (var i = 0; i < links.length; i += 1) {
			var text = links[i].textContent.trim();
			if (Object.prototype.hasOwnProperty.call(map, text)) {
				links[i].textContent = map[text];
			}
		}
	}

	// --- Admin privileges table: system group names -----------------------
	// global.tpl / category.tpl render the raw group identifier
	// ({privileges.groups.name}) with no translation key. We relabel only the
	// VISIBLE text; the real identifier stays in the row's data-group-name
	// attribute (load-bearing for saving privileges). Re-applied on the
	// in-page table refresh (scope change) via a MutationObserver.
	var GROUP_NAME_LABELS = {
		'registered-users': 'Utilisateurs enregistrés',
		'verified-users': 'Utilisateurs vérifiés',
		'unverified-users': 'Utilisateurs non vérifiés',
		'Global Moderators': 'Modérateurs globaux',
		'banned-users': 'Utilisateurs bannis',
		guests: 'Invités',
		spiders: "Robots d'indexation",
		fediverse: 'Fédiverse',
	};

	function relabelGroupRows(root) {
		var rows = (root || document).querySelectorAll('tr[data-group-name]');
		for (var i = 0; i < rows.length; i += 1) {
			var name = rows[i].getAttribute('data-group-name');
			if (!Object.prototype.hasOwnProperty.call(GROUP_NAME_LABELS, name)) {
				continue;
			}
			var french = GROUP_NAME_LABELS[name];
			var td = rows[i].getElementsByTagName('td')[0];
			if (!td) {
				continue;
			}
			// The group name is the first non-empty text node in the cell
			// (after the lock/warning <i> icon).
			for (var n = 0; n < td.childNodes.length; n += 1) {
				var node = td.childNodes[n];
				if (node.nodeType === 3 && node.nodeValue.trim().length) {
					if (node.nodeValue.trim() !== french) {
						node.nodeValue = ' ' + french;
					}
					break;
				}
			}
		}
	}

	function watchPrivilegeTables() {
		var containers = document.getElementsByClassName('privilege-table-container');
		for (var i = 0; i < containers.length; i += 1) {
			if (containers[i].__copObserved) {
				continue;
			}
			containers[i].__copObserved = true;
			var obs = new MutationObserver(function () {
				relabelGroupRows(document);
			});
			obs.observe(containers[i], { childList: true, subtree: true });
		}
	}

	function relabelOption(option, map) {
		var value = option.getAttribute('value');
		if (value === null) {
			return;
		}
		// Only relabel known identifiers; leave anything else as-is.
		if (!Object.prototype.hasOwnProperty.call(map, value)) {
			return;
		}
		var label = map[value];
		// Idempotency: skip if already showing the French label.
		if (option.textContent === label) {
			return;
		}
		option.textContent = label;
	}

	function relabelSelect(select, map) {
		if (!select) {
			return;
		}
		var options = select.getElementsByTagName('option');
		for (var i = 0; i < options.length; i += 1) {
			relabelOption(options[i], map);
		}
	}

	function relabelText(el, frenchText) {
		if (!el) {
			return;
		}
		if (el.textContent.trim() === frenchText) {
			return; // already relabelled
		}
		el.textContent = frenchText;
	}

	function applyRelabels() {
		// Account settings: homepage route <select>.
		relabelSelect(document.getElementById('homePageRoute'), HOMEPAGE_ROUTE_LABELS);

		// Admin sidebar: third-party plugin names in the Plugins section.
		relabelByText(document.getElementById('collapsePlugins'), PLUGIN_NAV_LABELS);

		// Admin privileges: system group name rows (re-applied on table refresh).
		relabelGroupRows(document);
		watchPrivilegeTables();

		// Admin email settings: email template editor + test-email dropdowns.
		relabelSelect(document.getElementById('email-editor-selector'), EMAIL_PATH_LABELS);
		relabelSelect(document.getElementById('test-email'), EMAIL_PATH_LABELS);

		// Admin email settings: hardcoded "Custom Service" card heading.
		var customCard = document.getElementById('email:smtpTransport:custom-service');
		if (customCard) {
			var heading = customCard.querySelector('h5');
			relabelText(heading, 'Service personnalisé');
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', applyRelabels);
	} else {
		applyRelabels();
	}

	// Re-apply after NodeBB AJAX navigation (SPA-style page swaps).
	if (typeof $ !== 'undefined' && $.fn) {
		$(window).on('action:ajaxify.end', applyRelabels);
	}
}());
