'use strict';

const path = require('path');
const nconf = require('nconf');

// Bootstrap NodeBB
nconf.argv().env({ separator: '__' });

const prestart = require('../src/prestart');
prestart.loadConfig(path.join(__dirname, '..', 'config.json'));
prestart.setupWinston();

async function main() {
	const db = require('../src/database');
	await db.init();

	// Check if sector field already exists
	const existing = await db.getObject('user-custom-field:sector');
	if (existing) {
		console.log('Sector field already exists, skipping.');
		process.exit(0);
	}

	const sectorField = {
		key: 'sector',
		name: '[[cop:profile.sector]]',
		icon: 'fa-solid fa-industry',
		type: 'select',
		'min:rep': 0,
		'select-options': [
			'[[cop:sector.health]]',
			'[[cop:sector.education]]',
			'[[cop:sector.environment]]',
			'[[cop:sector.agriculture]]',
			'[[cop:sector.governance]]',
			'[[cop:sector.social_protection]]',
			'[[cop:sector.infrastructure]]',
			'[[cop:sector.economy]]',
			'[[cop:sector.energy]]',
			'[[cop:sector.employment]]',
			'[[cop:sector.water]]',
		].join('\n'),
		visibility: 'all',
	};

	// Get current max score to place sector after existing fields
	const currentKeys = await db.getSortedSetRange('user-custom-fields', 0, -1);
	const score = currentKeys.length + 10;

	await db.sortedSetAdd('user-custom-fields', score, 'sector');
	await db.setObject('user-custom-field:sector', sectorField);

	console.log('✔ Sector custom field created successfully.');
	process.exit(0);
}

main().catch((err) => {
	console.error('Failed:', err);
	process.exit(1);
});
