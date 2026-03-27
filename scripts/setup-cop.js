'use strict';

const path = require('path');
const nconf = require('nconf');

// ── Bootstrap NodeBB ────────────────────────────────────────────────
nconf.argv().env({ separator: '__' });

const prestart = require('../src/prestart');
prestart.loadConfig(path.join(__dirname, '..', 'config.json'));
prestart.setupWinston();

// ── Configuration ───────────────────────────────────────────────────

const BRANDING = {
	title: 'Communauté de Pratique - Évaluation des Politiques Publiques',
	'title:short': 'CoP Évaluation',
	browserTitle: 'CoP Évaluation',
	description: 'Plateforme de la communauté de pratique en évaluation des politiques publiques en Côte d\'Ivoire',
	showSiteTitle: 1,
	defaultLang: 'fr',
	autoDetectLang: 0,
};

const CATEGORIES = [
	{
		name: 'Annonces',
		icon: 'fa-bullhorn',
		description: 'Annonces officielles et mises à jour de la communauté',
		order: 1,
	},
	{
		name: 'Discussions Générales',
		icon: 'fa-comments',
		description: 'Échanges libres entre membres de la communauté',
		order: 2,
	},
	{
		name: 'Méthodologie & Outils',
		icon: 'fa-wrench',
		description: 'Méthodes, outils et bonnes pratiques en évaluation',
		order: 3,
	},
	{
		name: 'Événements',
		icon: 'fa-calendar',
		description: 'Formations, webinaires et rencontres à venir',
		order: 4,
	},
];

const CUSTOM_FIELDS = [
	{
		key: 'fullname_org',
		name: '[[cop:profile.fullname_org]]',
		icon: 'fa-solid fa-user-tie',
		type: 'input-text',
		'min:rep': 0,
		'select-options': '',
		visibility: 'all',
	},
	{
		key: 'title_role',
		name: '[[cop:profile.title_role]]',
		icon: 'fa-solid fa-id-badge',
		type: 'input-text',
		'min:rep': 0,
		'select-options': '',
		visibility: 'all',
	},
	{
		key: 'org_type',
		name: '[[cop:profile.org_type]]',
		icon: 'fa-solid fa-building',
		type: 'select',
		'min:rep': 0,
		'select-options': [
			'[[cop:org_type.consultant]]',
			'[[cop:org_type.public_admin]]',
			'[[cop:org_type.ngo]]',
			'[[cop:org_type.university]]',
			'[[cop:org_type.international]]',
		].join('\n'),
		visibility: 'all',
	},
	{
		key: 'expertise',
		name: '[[cop:profile.expertise]]',
		icon: 'fa-solid fa-chart-line',
		type: 'select-multi',
		'min:rep': 0,
		'select-options': [
			'[[cop:expertise.health]]',
			'[[cop:expertise.education]]',
			'[[cop:expertise.environment]]',
			'[[cop:expertise.agriculture]]',
			'[[cop:expertise.governance]]',
			'[[cop:expertise.social_protection]]',
			'[[cop:expertise.infrastructure]]',
			'[[cop:expertise.economy]]',
			'[[cop:expertise.gender]]',
			'[[cop:expertise.urban]]',
			'[[cop:expertise.energy]]',
			'[[cop:expertise.employment]]',
			'[[cop:expertise.water]]',
			'[[cop:expertise.other]]',
		].join('\n'),
		visibility: 'all',
	},
	{
		key: 'region',
		name: '[[cop:profile.region]]',
		icon: 'fa-solid fa-map-location-dot',
		type: 'select',
		'min:rep': 0,
		'select-options': [
			'[[cop:region.abidjan]]',
			'[[cop:region.yamoussoukro]]',
			'[[cop:region.bas_sassandra]]',
			'[[cop:region.comoe]]',
			'[[cop:region.denguele]]',
			'[[cop:region.goh_djiboua]]',
			'[[cop:region.lacs]]',
			'[[cop:region.lagunes]]',
			'[[cop:region.montagnes]]',
			'[[cop:region.sassandra_marahoue]]',
			'[[cop:region.savanes]]',
			'[[cop:region.vallee_bandama]]',
			'[[cop:region.woroba]]',
			'[[cop:region.zanzan]]',
		].join('\n'),
		visibility: 'all',
	},
	{
		key: 'bio_pro',
		name: '[[cop:profile.bio_pro]]',
		icon: 'fa-solid fa-pen-fancy',
		type: 'textarea',
		'min:rep': 0,
		'select-options': '',
		visibility: 'loggedin',
	},
];

const ADMIN_UID = 1;

// ── Main ────────────────────────────────────────────────────────────

async function main() {
	const db = require('../src/database');
	await db.init();

	const meta = require('../src/meta');
	await meta.configs.init();

	const Categories = require('../src/categories');
	const User = require('../src/user');
	const groups = require('../src/groups');
	const privileges = require('../src/privileges');
	await privileges.init();

	// 1. Branding
	console.log('\n── Setting site branding ──');
	await meta.configs.setMultiple(BRANDING);
	for (const [key, value] of Object.entries(BRANDING)) {
		console.log(`  ${key} = ${value}`);
	}

	// 2. Delete default categories
	console.log('\n── Removing default categories ──');
	const existingCids = await Categories.getAllCidsFromSet('categories:cid');
	if (existingCids.length) {
		for (const cid of existingCids) {
			const name = await Categories.getCategoryField(cid, 'name');
			await Categories.purge(cid, ADMIN_UID);
			console.log(`  Deleted: "${name}" (cid ${cid})`);
		}
	} else {
		console.log('  No existing categories to remove.');
	}

	// 3. Create CoP categories
	console.log('\n── Creating CoP categories ──');
	for (const cat of CATEGORIES) {
		const created = await Categories.create(cat);
		console.log(`  Created: "${created.name}" (cid ${created.cid}, icon ${cat.icon})`);
	}

	// 4. Verify user roles
	console.log('\n── Verifying user roles ──');
	const requiredGroups = ['administrators', 'Global Moderators', 'registered-users'];
	for (const groupName of requiredGroups) {
		const exists = await groups.exists(groupName);
		console.log(`  ${groupName}: ${exists ? 'OK' : 'MISSING!'}`);
	}

	// 5. Create custom profile fields
	console.log('\n── Creating custom profile fields ──');
	const fieldKeys = CUSTOM_FIELDS.map(f => f.key);
	const fieldScores = CUSTOM_FIELDS.map((_, i) => i + 10);
	await db.sortedSetAdd('user-custom-fields', fieldScores, fieldKeys);
	await db.setObjectBulk(
		CUSTOM_FIELDS.map(f => [`user-custom-field:${f.key}`, f])
	);
	for (const f of CUSTOM_FIELDS) {
		console.log(`  ${f.key} (${f.type}, visibility: ${f.visibility})`);
	}

	// Done
	console.log('\n✔ Setup complete. Restart NodeBB to see changes.\n');
	process.exit(0);
}

main().catch((err) => {
	console.error('Setup failed:', err);
	process.exit(1);
});
