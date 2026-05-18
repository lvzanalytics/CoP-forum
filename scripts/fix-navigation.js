'use strict';

/**
 * One-time script to remove "World" and "Recent" navigation items from the DB.
 * This is equivalent to unchecking them in Admin > Navigation.
 * Run: node scripts/fix-navigation.js
 */

const nconf = require('nconf');
const path = require('path');

// Load config the same way NodeBB does
nconf.file({ file: path.join(__dirname, '..', 'config.json') });
nconf.defaults({ base_dir: path.join(__dirname, '..') });

async function main() {
	const db = require('../src/database');
	await db.init();

	const ids = await db.getSortedSetRange('navigation:enabled', 0, -1);
	const items = await db.getObjects(ids.map(id => `navigation:enabled:${id}`));

	const routesToRemove = ['/world', '/recent'];
	const keepItems = [];

	for (const item of items) {
		if (item && routesToRemove.includes(item.route)) {
			console.log(`Removing nav item: "${item.title || item.text}" (route: ${item.route})`);
		} else if (item) {
			keepItems.push(item);
		}
	}

	if (keepItems.length === items.filter(Boolean).length) {
		console.log('No matching navigation items found (already removed).');
		process.exit(0);
	}

	// Re-save using the same logic as admin.save()
	// Clear existing data
	await db.deleteAll(ids.map(id => `navigation:enabled:${id}`));
	await db.delete('navigation:enabled');

	// Write back only the items we want to keep
	const order = keepItems.map((_, i) => i);
	const bulkSet = keepItems.map((item, index) => {
		item.order = index;
		if (Array.isArray(item.groups)) {
			item.groups = JSON.stringify(item.groups);
		}
		return [`navigation:enabled:${index}`, item];
	});

	if (bulkSet.length) {
		await db.setObjectBulk(bulkSet);
		await db.sortedSetAdd('navigation:enabled', order, order);
	}

	console.log(`Done. Kept ${keepItems.length} nav items, removed ${items.filter(Boolean).length - keepItems.length}.`);
	console.log('Rebuild and restart NodeBB to apply changes.');
	process.exit(0);
}

main().catch((err) => {
	console.error('Error:', err);
	process.exit(1);
});
