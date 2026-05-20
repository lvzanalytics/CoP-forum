'use strict';

/**
 * Apply corrections: SMTP config + favicon.
 * Run: node scripts/configure-smtp.js
 */

const nconf = require('nconf');
const path = require('path');

nconf.file({ file: path.join(__dirname, '..', 'config.json') });
nconf.defaults({
	base_dir: path.join(__dirname, '..'),
	themes_path: path.join(__dirname, '..', 'node_modules'),
	upload_path: 'public/uploads',
	views_dir: path.join(__dirname, '..', 'build/public/templates'),
	relative_path: '',
});

async function main() {
	const db = require('../src/database');
	await db.init();

	const meta = require('../src/meta');
	await meta.configs.init();

	const settings = {
		// SMTP (SMTP2GO)
		'email:smtpTransport:enabled': '1',
		'email:smtpTransport:service': 'nodebb-custom-smtp',
		'email:smtpTransport:host': 'mail.smtp2go.com',
		'email:smtpTransport:port': '2525',
		'email:smtpTransport:user': 'lvzanalytics',
		'email:smtpTransport:pass': 'aCDWxuyLm2F8SYaV',
		'email:smtpTransport:security': 'STARTTLS',
		'email:from': 'CoP Forum <noreply@lvzanlytics.com>',
		// Favicon
		'brand:favicon': '/assets/uploads/system/favicon.png',
	};

	for (const [key, value] of Object.entries(settings)) {
		await meta.configs.set(key, value);
	}

	// Group cover images
	const groups = require('../src/groups');
	const groupCovers = {
		administrators: '/plugins/nodebb-theme-cop/cop/landing/hero-bg.jpg',
		'Global Moderators': '/plugins/nodebb-theme-cop/cop/landing/cta-bg.jpg',
	};
	for (const [groupName, coverUrl] of Object.entries(groupCovers)) {
		await groups.setGroupField(groupName, 'cover:url', coverUrl);
	}

	console.log('Settings configured:');
	console.log('  SMTP: mail.smtp2go.com:2525 (STARTTLS)');
	console.log('  Favicon: /assets/uploads/system/favicon.png');
	console.log('  Group covers: administrators, Global Moderators');

	await db.close();
	process.exit(0);
}

main().catch((err) => {
	console.error('Failed to configure settings:', err);
	process.exit(1);
});
