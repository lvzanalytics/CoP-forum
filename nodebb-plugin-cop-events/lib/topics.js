'use strict';

const Topics = require.main.require('./src/topics');
const Posts = require.main.require('./src/posts');
const meta = require.main.require('./src/meta');
const nconf = require.main.require('nconf');
const winston = require.main.require('winston');

const eventTopics = module.exports;

const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function formatDate(ts) {
	const d = new Date(parseInt(ts, 10));
	return `${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatTime(ts) {
	const d = new Date(parseInt(ts, 10));
	const h = d.getUTCHours().toString().padStart(2, '0');
	const m = d.getUTCMinutes().toString().padStart(2, '0');
	return `${h}:${m}`;
}

function buildTopicContent(event) {
	const relativePath = nconf.get('relative_path') || '';
	const lines = [];

	lines.push(`**Date :** ${formatDate(event.startDate)}`);

	let timeStr = formatTime(event.startDate);
	if (parseInt(event.endDate, 10)) {
		timeStr += ` - ${formatTime(event.endDate)}`;
	}
	timeStr += ' (Africa/Abidjan)';
	lines.push(`**Heure :** ${timeStr}`);

	if (event.location) {
		lines.push(`**Lieu :** ${event.location}`);
	}
	if (event.meetingLink) {
		lines.push(`**Lien de la réunion :** [Rejoindre la réunion](${event.meetingLink})`);
	}
	if (event.registrationLink) {
		lines.push(`**Lien d'inscription :** [S'inscrire](${event.registrationLink})`);
	}

	lines.push('');
	lines.push('---');
	lines.push('');

	if (event.description) {
		lines.push(event.description);
		lines.push('');
		lines.push('---');
		lines.push('');
	}

	lines.push(`*Cet événement est géré via la plateforme. [Voir les détails de l'événement](${relativePath}/events/${event.slug})*`);

	return lines.join('\n');
}

eventTopics.createEventTopic = async function (event, uid) {
	const settings = await meta.settings.get('cop-events');
	const cid = parseInt(settings.defaultCategory, 10) || 4;

	const content = buildTopicContent(event);

	try {
		const result = await Topics.post({
			uid: uid,
			cid: cid,
			title: event.title,
			content: content,
			tags: [event.sector].filter(Boolean),
		});
		return result.topicData.tid;
	} catch (err) {
		winston.warn(`[cop-events] Could not create topic for event ${event.eventId}: ${err.message}`);
		return 0;
	}
};

eventTopics.updateEventTopic = async function (event) {
	const tid = parseInt(event.tid, 10);
	if (!tid) return;

	try {
		const mainPid = await Topics.getTopicField(tid, 'mainPid');
		if (!mainPid) return;

		const content = buildTopicContent(event);
		await Posts.edit({
			pid: mainPid,
			uid: event.uid,
			content: content,
		});

		// Update topic title if changed
		await Topics.setTopicField(tid, 'title', event.title);
	} catch (err) {
		winston.warn(`[cop-events] Could not update topic for event ${event.eventId}: ${err.message}`);
	}
};

eventTopics.deleteEventTopic = async function (tid, uid) {
	tid = parseInt(tid, 10);
	if (!tid) return;

	try {
		await Topics.purge(tid, uid);
	} catch (err) {
		winston.warn(`[cop-events] Could not delete topic ${tid}: ${err.message}`);
	}
};
