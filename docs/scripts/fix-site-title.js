'use strict';

/**
 * One-time script to update the site title in the DB.
 * Changes "CoP Évaluation" to "CoP évaluation" (lowercase é)
 * Run: node docs/scripts/fix-site-title.js
 */

const nconf = require('nconf');
const path = require('path');

nconf.file({ file: path.join(__dirname, '..', '..', 'config.json') });
nconf.defaults({ base_dir: path.join(__dirname, '..', '..') });

async function main() {
	const db = require('../../src/database');
	await db.init();

	const newTitle = 'CoP évaluation';

	const current = await db.getObjectFields('config', ['title', 'browserTitle']);
	console.log('Current title:', current.title);
	console.log('Current browserTitle:', current.browserTitle);

	await db.setObject('config', {
		title: newTitle,
		browserTitle: newTitle,
	});

	const updated = await db.getObjectFields('config', ['title', 'browserTitle']);
	console.log('Updated title:', updated.title);
	console.log('Updated browserTitle:', updated.browserTitle);

	process.exit(0);
}

main().catch((err) => {
	console.error('Error:', err);
	process.exit(1);
});
