'use strict';

/**
 * Standalone script to:
 * 1. Update select-options for the three custom profile fields
 *    (org_type, expertise, region) from hardcoded French → translation keys
 * 2. Migrate existing user values so saved selections aren't lost
 *
 * This does NOT delete categories or re-create fields.
 *
 * Usage: node scripts/update-field-options.js
 */

const path = require('path');
const nconf = require('nconf');

// Bootstrap NodeBB config
nconf.argv().env({ separator: '__' });
const prestart = require('../src/prestart');
prestart.loadConfig(path.join(__dirname, '..', 'config.json'));
prestart.setupWinston();

// Maps: old hardcoded French value → new translation key
const VALUE_MIGRATIONS = {
	org_type: {
		'Consultant indépendant': '[[cop:org_type.consultant]]',
		'Administration publique': '[[cop:org_type.public_admin]]',
		'ONG / Société civile': '[[cop:org_type.ngo]]',
		'Université / Recherche': '[[cop:org_type.university]]',
		'Organisation internationale': '[[cop:org_type.international]]',
	},
	expertise: {
		'Santé': '[[cop:expertise.health]]',
		'Éducation': '[[cop:expertise.education]]',
		'Environnement & Climat': '[[cop:expertise.environment]]',
		'Agriculture & Sécurité alimentaire': '[[cop:expertise.agriculture]]',
		'Gouvernance & Institutions': '[[cop:expertise.governance]]',
		'Protection sociale': '[[cop:expertise.social_protection]]',
		'Infrastructure & Transport': '[[cop:expertise.infrastructure]]',
		'Économie & Finances publiques': '[[cop:expertise.economy]]',
		'Genre & Inclusion': '[[cop:expertise.gender]]',
		'Développement urbain': '[[cop:expertise.urban]]',
		'Énergie & Ressources naturelles': '[[cop:expertise.energy]]',
		'Emploi & Formation professionnelle': '[[cop:expertise.employment]]',
		'Eau & Assainissement': '[[cop:expertise.water]]',
		'Autre': '[[cop:expertise.other]]',
	},
	region: {
		'District Autonome d\'Abidjan': '[[cop:region.abidjan]]',
		'District Autonome de Yamoussoukro': '[[cop:region.yamoussoukro]]',
		'Bas-Sassandra': '[[cop:region.bas_sassandra]]',
		'Comoé': '[[cop:region.comoe]]',
		'Denguélé': '[[cop:region.denguele]]',
		'Gôh-Djiboua': '[[cop:region.goh_djiboua]]',
		'Lacs': '[[cop:region.lacs]]',
		'Lagunes': '[[cop:region.lagunes]]',
		'Montagnes': '[[cop:region.montagnes]]',
		'Sassandra-Marahoué': '[[cop:region.sassandra_marahoue]]',
		'Savanes': '[[cop:region.savanes]]',
		'Vallée du Bandama': '[[cop:region.vallee_bandama]]',
		'Woroba': '[[cop:region.woroba]]',
		'Zanzan': '[[cop:region.zanzan]]',
	},
};

const FIELD_OPTIONS = {
	org_type: Object.values(VALUE_MIGRATIONS.org_type).join('\n'),
	expertise: Object.values(VALUE_MIGRATIONS.expertise).join('\n'),
	region: Object.values(VALUE_MIGRATIONS.region).join('\n'),
};

async function main() {
	const db = require('../src/database');
	await db.init();

	// ── Step 1: Update field definitions ──
	console.log('\n── Updating custom field select-options ──');

	for (const [key, options] of Object.entries(FIELD_OPTIONS)) {
		await db.setObjectField(`user-custom-field:${key}`, 'select-options', options);
		const optionCount = options.split('\n').length;
		console.log(`  ${key}: updated (${optionCount} options)`);
	}

	// ── Step 2: Migrate existing user values ──
	console.log('\n── Migrating existing user values ──');

	const uids = await db.getSortedSetRange('users:joindate', 0, -1);
	if (!uids.length) {
		console.log('  No users found, skipping migration.');
	} else {
		console.log(`  Found ${uids.length} user(s), scanning...`);
		let totalMigrated = 0;

		for (const uid of uids) {
			const userData = await db.getObjectFields(`user:${uid}`, ['org_type', 'expertise', 'region']);

			// Migrate org_type (select — single string value)
			if (userData.org_type && VALUE_MIGRATIONS.org_type[userData.org_type]) {
				await db.setObjectField(`user:${uid}`, 'org_type', VALUE_MIGRATIONS.org_type[userData.org_type]);
				console.log(`  uid ${uid}: org_type "${userData.org_type}" → "${VALUE_MIGRATIONS.org_type[userData.org_type]}"`);
				totalMigrated++;
			}

			// Migrate region (select — single string value)
			if (userData.region && VALUE_MIGRATIONS.region[userData.region]) {
				await db.setObjectField(`user:${uid}`, 'region', VALUE_MIGRATIONS.region[userData.region]);
				console.log(`  uid ${uid}: region "${userData.region}" → "${VALUE_MIGRATIONS.region[userData.region]}"`);
				totalMigrated++;
			}

			// Migrate expertise (select-multi — JSON array of strings)
			if (userData.expertise) {
				let values;
				try {
					values = JSON.parse(userData.expertise);
				} catch {
					// Not JSON, treat as single value
					if (VALUE_MIGRATIONS.expertise[userData.expertise]) {
						await db.setObjectField(`user:${uid}`, 'expertise', JSON.stringify([VALUE_MIGRATIONS.expertise[userData.expertise]]));
						console.log(`  uid ${uid}: expertise (single) migrated`);
						totalMigrated++;
					}
					continue;
				}

				if (Array.isArray(values)) {
					let changed = false;
					const migrated = values.map((v) => {
						if (VALUE_MIGRATIONS.expertise[v]) {
							changed = true;
							return VALUE_MIGRATIONS.expertise[v];
						}
						return v;
					});
					if (changed) {
						await db.setObjectField(`user:${uid}`, 'expertise', JSON.stringify(migrated));
						console.log(`  uid ${uid}: expertise array migrated (${migrated.length} values)`);
						totalMigrated++;
					}
				}
			}
		}

		console.log(`  ${totalMigrated} field value(s) migrated across ${uids.length} user(s).`);
	}

	console.log('\n✔ Field options and user values updated. Restart NodeBB to see changes.\n');
	process.exit(0);
}

main().catch((err) => {
	console.error('Update failed:', err);
	process.exit(1);
});
