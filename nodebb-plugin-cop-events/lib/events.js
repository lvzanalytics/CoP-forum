'use strict';

const db = require.main.require('./src/database');
const User = require.main.require('./src/user');
const slugify = require.main.require('./src/slugify');

const events = module.exports;

const MONTHS_FR = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
const MONTHS_FULL_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

events.create = async function (data) {
	const eventId = await db.incrObjectField('global', 'nextEventId');
	const slug = (slugify(data.title) || 'evenement') + '-' + eventId;
	const now = Date.now();
	const startDate = parseInt(data.startDate, 10) || now;

	const eventData = {
		eventId: eventId,
		title: data.title,
		slug: slug,
		description: data.description || '',
		sector: data.sector || '',
		region: data.region || '',
		startDate: startDate,
		endDate: parseInt(data.endDate, 10) || 0,
		allDay: data.allDay ? 1 : 0,
		meetingLink: data.meetingLink || '',
		meetingPlatform: data.meetingPlatform || '',
		registrationLink: data.registrationLink || '',
		bannerUrl: data.bannerUrl || '',
		location: data.location || '',
		timezone: 'Africa/Abidjan',
		uid: data.uid,
		tid: 0,
		status: startDate > now ? 'upcoming' : 'past',
		createdAt: now,
		updatedAt: now,
	};

	await db.setObject(`event:${eventId}`, eventData);
	await db.setObjectField('event:slug', slug, eventId);

	// Index by date
	await db.sortedSetAdd('events:datetime', startDate, eventId);

	// Index by creator
	await db.sortedSetAdd(`events:uid:${data.uid}`, startDate, eventId);

	// Index by sector
	if (data.sector) {
		await db.sortedSetAdd(`events:sector:${data.sector}`, startDate, eventId);
	}

	// Index by region
	if (data.region) {
		await db.sortedSetAdd(`events:region:${data.region}`, startDate, eventId);
	}

	return eventData;
};

events.get = async function (eventId) {
	const event = await db.getObject(`event:${eventId}`);
	if (!event) {
		return null;
	}
	return enrichEvent(event);
};

events.getBySlug = async function (slug) {
	const eventId = await db.getObjectField('event:slug', slug);
	if (!eventId) {
		return null;
	}
	return events.get(eventId);
};

events.update = async function (eventId, data) {
	const event = await db.getObject(`event:${eventId}`);
	if (!event) {
		return null;
	}

	const now = Date.now();
	const newStartDate = parseInt(data.startDate, 10) || event.startDate;
	const newSlug = (slugify(data.title) || 'evenement') + '-' + eventId;

	const updates = {
		title: data.title,
		slug: newSlug,
		description: data.description || '',
		sector: data.sector || '',
		region: data.region || '',
		startDate: newStartDate,
		endDate: parseInt(data.endDate, 10) || 0,
		allDay: data.allDay ? 1 : 0,
		meetingLink: data.meetingLink || '',
		meetingPlatform: data.meetingPlatform || '',
		registrationLink: data.registrationLink || '',
		location: data.location || '',
		status: newStartDate > now ? 'upcoming' : 'past',
		updatedAt: now,
	};

	if (data.bannerUrl !== undefined) {
		updates.bannerUrl = data.bannerUrl;
	}

	await db.setObject(`event:${eventId}`, updates);

	// Update slug mapping
	if (event.slug !== newSlug) {
		await db.deleteObjectField('event:slug', event.slug);
		await db.setObjectField('event:slug', newSlug, eventId);
	}

	// Update date index if changed
	if (String(event.startDate) !== String(newStartDate)) {
		await db.sortedSetAdd('events:datetime', newStartDate, eventId);
	}

	// Re-index sector if changed
	if (event.sector !== data.sector) {
		if (event.sector) {
			await db.sortedSetRemove(`events:sector:${event.sector}`, eventId);
		}
		if (data.sector) {
			await db.sortedSetAdd(`events:sector:${data.sector}`, newStartDate, eventId);
		}
	}

	// Re-index region if changed
	if (event.region !== data.region) {
		if (event.region) {
			await db.sortedSetRemove(`events:region:${event.region}`, eventId);
		}
		if (data.region) {
			await db.sortedSetAdd(`events:region:${data.region}`, newStartDate, eventId);
		}
	}

	return { ...event, ...updates };
};

events.setTopicId = async function (eventId, tid) {
	await db.setObjectField(`event:${eventId}`, 'tid', tid);
	await db.setObjectField(`event:tid:${tid}`, 'eventId', eventId);
};

events.getByTid = async function (tid) {
	const mapping = await db.getObject(`event:tid:${tid}`);
	if (!mapping || !mapping.eventId) return null;
	return await db.getObject(`event:${mapping.eventId}`);
};

events.getByTids = async function (tids) {
	const keys = tids.map(tid => `event:tid:${tid}`);
	const mappings = await db.getObjects(keys);
	const eventKeys = mappings.map(m => (m && m.eventId ? `event:${m.eventId}` : null));
	const results = await Promise.all(eventKeys.map(k => (k ? db.getObject(k) : null)));
	return results;
};

events.delete = async function (eventId) {
	const event = await db.getObject(`event:${eventId}`);
	if (!event) {
		return null;
	}

	// Remove from all indexes
	await db.sortedSetRemove('events:datetime', eventId);
	if (event.uid) {
		await db.sortedSetRemove(`events:uid:${event.uid}`, eventId);
	}
	if (event.sector) {
		await db.sortedSetRemove(`events:sector:${event.sector}`, eventId);
	}
	if (event.region) {
		await db.sortedSetRemove(`events:region:${event.region}`, eventId);
	}

	// Remove slug mapping
	if (event.slug) {
		await db.deleteObjectField('event:slug', event.slug);
	}

	// Remove RSVP data
	await db.delete(`event:${eventId}:rsvps`);

	// Remove event object
	await db.delete(`event:${eventId}`);

	return event;
};

events.getUpcoming = async function (start, stop) {
	const now = Date.now();
	const eventIds = await db.getSortedSetRangeByScore('events:datetime', start, stop - start + 1, now, '+inf');
	return getEvents(eventIds);
};

events.getPast = async function (start, stop) {
	const now = Date.now();
	const eventIds = await db.getSortedSetRevRangeByScore('events:datetime', start, stop - start + 1, now, '-inf');
	return getEvents(eventIds);
};

events.getAll = async function (start, stop) {
	const eventIds = await db.getSortedSetRange('events:datetime', start, stop);
	return getEvents(eventIds);
};

events.getByMonth = async function (year, month) {
	// month is 0-indexed (0 = January)
	const monthStart = new Date(Date.UTC(year, month, 1)).getTime();
	const monthEnd = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)).getTime();
	const eventIds = await db.getSortedSetRangeByScore('events:datetime', 0, -1, monthStart, monthEnd);
	return getEvents(eventIds);
};

events.getTotalUpcoming = async function () {
	const now = Date.now();
	return db.sortedSetCount('events:datetime', now, '+inf');
};

events.getTotalPast = async function () {
	const now = Date.now();
	return db.sortedSetCount('events:datetime', '-inf', now);
};

events.search = async function (filters, start, stop) {
	let eventIds;

	if (filters.sector) {
		eventIds = await db.getSortedSetRange(`events:sector:${filters.sector}`, 0, -1);
	} else if (filters.region) {
		eventIds = await db.getSortedSetRange(`events:region:${filters.region}`, 0, -1);
	} else if (filters.tab === 'past') {
		const now = Date.now();
		eventIds = await db.getSortedSetRevRangeByScore('events:datetime', 0, -1, now, '-inf');
	} else {
		const now = Date.now();
		eventIds = await db.getSortedSetRangeByScore('events:datetime', 0, -1, now, '+inf');
	}

	const allEvents = await getEvents(eventIds);

	// Text search filter
	const filtered = allEvents.filter((ev) => {
		if (!ev) return false;
		if (filters.q) {
			const q = filters.q.toLowerCase();
			const matchTitle = ev.title && ev.title.toLowerCase().includes(q);
			const matchDesc = ev.description && ev.description.toLowerCase().includes(q);
			if (!matchTitle && !matchDesc) return false;
		}
		if (filters.region && filters.sector) {
			// Both active — events already filtered by one via sorted set
			if (ev.region !== filters.region) return false;
		}
		return true;
	});

	const total = filtered.length;
	const paged = filtered.slice(start, stop + 1);
	return { events: paged, total: total };
};

// RSVP
events.addRsvp = async function (eventId, uid) {
	await db.setAdd(`event:${eventId}:rsvps`, uid);
};

events.removeRsvp = async function (eventId, uid) {
	await db.setRemove(`event:${eventId}:rsvps`, uid);
};

events.getRsvpCount = async function (eventId) {
	return db.setCount(`event:${eventId}:rsvps`);
};

events.isRsvpd = async function (eventId, uid) {
	if (!uid) return false;
	return db.isSetMember(`event:${eventId}:rsvps`, uid);
};

// Helpers
async function getEvents(eventIds) {
	if (!eventIds || !eventIds.length) return [];
	const keys = eventIds.map(id => `event:${id}`);
	const eventsData = await db.getObjects(keys);

	// Attach user data
	const uids = eventsData.filter(Boolean).map(e => e.uid);
	const uniqueUids = [...new Set(uids)];
	const usersData = await User.getUsersFields(uniqueUids, ['uid', 'username', 'userslug', 'picture']);
	const userMap = {};
	usersData.forEach((u) => {
		if (u && u.uid) userMap[u.uid] = u;
	});

	return eventsData.filter(Boolean).map(ev => enrichEvent(ev, userMap));
}

function enrichEvent(ev, userMap) {
	if (!ev) return null;

	const startDate = parseInt(ev.startDate, 10);
	const endDate = parseInt(ev.endDate, 10);
	const d = new Date(startDate);

	ev.day = String(d.getUTCDate());
	ev.month = MONTHS_FR[d.getUTCMonth()];
	ev.monthFull = MONTHS_FULL_FR[d.getUTCMonth()];
	ev.year = d.getUTCFullYear();
	ev.startDateFormatted = `${ev.day} ${ev.monthFull} ${ev.year}`;
	ev.startTime = padTime(d.getUTCHours()) + ':' + padTime(d.getUTCMinutes());
	ev.startDateISO = d.toISOString().slice(0, 10);

	if (endDate) {
		const e = new Date(endDate);
		ev.endTime = padTime(e.getUTCHours()) + ':' + padTime(e.getUTCMinutes());
		ev.endDateISO = e.toISOString().slice(0, 10);
		ev.endDateFormatted = `${e.getUTCDate()} ${MONTHS_FULL_FR[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
	} else {
		ev.endTime = '';
		ev.endDateISO = '';
		ev.endDateFormatted = '';
	}

	ev.startTimeFormatted = ev.startTime + (ev.endTime ? ' - ' + ev.endTime : '') + ' (WAT)';

	// User data
	if (userMap && ev.uid) {
		ev.user = userMap[ev.uid] || {};
	} else if (!ev.user && ev.uid) {
		ev.user = {};
	}

	return ev;
}

function padTime(n) {
	return n < 10 ? '0' + n : String(n);
}
