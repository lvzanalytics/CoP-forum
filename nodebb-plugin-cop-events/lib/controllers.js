'use strict';

const nconf = require.main.require('nconf');
const meta = require.main.require('./src/meta');
const pagination = require.main.require('./src/pagination');
const controllerHelpers = require.main.require('./src/controllers/helpers');
const User = require.main.require('./src/user');

const events = require('./events');
const eventTopics = require('./topics');
const storage = require('./storage');

const controllers = module.exports;

const EVENTS_PER_PAGE = 12;

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const DEFAULT_SETTINGS = {
	defaultCategory: '4',
	requireApproval: '0',
};

async function getSettings() {
	const settings = await meta.settings.get('cop-events');
	return { ...DEFAULT_SETTINGS, ...settings };
}

async function canEdit(uid, event) {
	if (!uid) return false;
	const isCreator = String(uid) === String(event.uid);
	if (isCreator) return true;
	return User.isAdminOrGlobalMod(uid);
}

// Page controllers

controllers.list = async function (req, res) {
	const page = Math.max(1, parseInt(req.query.page, 10) || 1);
	const tab = req.query.tab || 'upcoming';
	const start = (page - 1) * EVENTS_PER_PAGE;
	const stop = start + EVENTS_PER_PAGE - 1;

	const filters = {
		region: req.query.region || '',
		sector: req.query.sector || '',
		q: req.query.q || '',
		tab: tab,
	};

	const { events: eventsList, total } = await events.search(filters, start, stop);
	const pageCount = Math.max(1, Math.ceil(total / EVENTS_PER_PAGE));

	const queryObj = { ...req.query };
	delete queryObj.page;

	res.render('events/list', {
		title: '[[cop-events:events.title]]',
		events: eventsList,
		view: 'list',
		tab: tab,
		filters: filters,
		pagination: pagination.create(page, pageCount, queryObj),
		loggedIn: req.loggedIn,
	});
};

controllers.calendar = async function (req, res) {
	const now = new Date();
	const year = parseInt(req.query.year, 10) || now.getUTCFullYear();
	const month = parseInt(req.query.month, 10);
	const currentMonth = (isNaN(month) ? now.getUTCMonth() : month);

	const monthEvents = await events.getByMonth(year, currentMonth);

	// Build calendar grid
	const weeks = buildCalendarGrid(year, currentMonth, monthEvents);

	// Prev/next month
	let prevMonth = currentMonth - 1;
	let prevYear = year;
	if (prevMonth < 0) { prevMonth = 11; prevYear--; }

	let nextMonth = currentMonth + 1;
	let nextYear = year;
	if (nextMonth > 11) { nextMonth = 0; nextYear++; }

	res.render('events/calendar', {
		title: '[[cop-events:events.calendar]]',
		view: 'calendar',
		monthName: MONTHS_FR[currentMonth],
		year: year,
		weeks: weeks,
		daysOfWeek: DAYS_FR,
		prevUrl: `${nconf.get('relative_path')}/events/calendar?year=${prevYear}&month=${prevMonth}`,
		nextUrl: `${nconf.get('relative_path')}/events/calendar?year=${nextYear}&month=${nextMonth}`,
	});
};

controllers.view = async function (req, res) {
	const event = await events.getBySlug(req.params.slug);
	if (!event) {
		return controllerHelpers.notFound(req, res);
	}

	// Attach full user data for organizer display
	if (event.uid) {
		event.user = await User.getUserFields(event.uid, ['uid', 'username', 'userslug', 'picture']);
	}

	const userCanEdit = await canEdit(req.uid, event);
	const rsvpd = await events.isRsvpd(event.eventId, req.uid);
	const rsvpCount = await events.getRsvpCount(event.eventId);

	res.render('events/view', {
		title: event.title,
		event: event,
		canEdit: userCanEdit,
		rsvpd: rsvpd,
		rsvpCount: rsvpCount,
		loggedIn: req.loggedIn,
	});
};

controllers.create = async function (req, res) {
	res.render('events/form', {
		title: '[[cop-events:events.create]]',
		event: {},
		isNew: true,
	});
};

controllers.edit = async function (req, res) {
	const event = await events.getBySlug(req.params.slug);
	if (!event) {
		return controllerHelpers.notFound(req, res);
	}

	const userCanEdit = await canEdit(req.uid, event);
	if (!userCanEdit) {
		return controllerHelpers.notAllowed(req, res);
	}

	res.render('events/form', {
		title: '[[cop-events:events.edit]]',
		event: event,
		isNew: false,
	});
};

// API controllers

controllers.handleCreate = async function (req, res) {
	if (!req.uid) {
		return controllerHelpers.formatApiResponse(401, res, new Error('[[error:not-logged-in]]'));
	}

	const { title, sector, region, startDate, startTime, endDate, endTime, meetingLink, meetingPlatform, registrationLink, description, location } = req.body;

	if (!title || !startDate || !startTime) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-events:events.error_required]]'));
	}

	// Parse dates
	const startTs = parseDateTime(startDate, startTime);
	const endTs = (endDate && endTime) ? parseDateTime(endDate, endTime) : 0;

	if (endTs && endTs <= startTs) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-events:events.error_date]]'));
	}

	// Handle banner upload
	let bannerUrl = '';
	if (req.files && req.files.length) {
		const file = req.files[0];
		const saved = await storage.save({
			name: `${Date.now()}-${file.originalname}`,
			path: file.path,
		});
		bannerUrl = saved.url;
	}

	const eventData = await events.create({
		title, description, sector, region, location,
		startDate: startTs,
		endDate: endTs,
		meetingLink, meetingPlatform, registrationLink,
		bannerUrl: bannerUrl,
		uid: req.uid,
	});

	// Auto-create topic in Événements category
	const tid = await eventTopics.createEventTopic(eventData, req.uid);
	if (tid) {
		await events.setTopicId(eventData.eventId, tid);
		eventData.tid = tid;
	}

	return controllerHelpers.formatApiResponse(200, res, {
		eventId: eventData.eventId,
		slug: eventData.slug,
		redirectUrl: `${nconf.get('relative_path')}/events/${eventData.slug}`,
	});
};

controllers.handleUpdate = async function (req, res) {
	if (!req.uid) {
		return controllerHelpers.formatApiResponse(401, res, new Error('[[error:not-logged-in]]'));
	}

	const event = await events.get(req.params.eventId);
	if (!event) {
		return controllerHelpers.formatApiResponse(404, res, new Error('[[error:not-found]]'));
	}

	const userCanEdit = await canEdit(req.uid, event);
	if (!userCanEdit) {
		return controllerHelpers.formatApiResponse(403, res, new Error('[[error:no-privileges]]'));
	}

	const { title, sector, region, startDate, startTime, endDate, endTime, meetingLink, meetingPlatform, registrationLink, description, location } = req.body;

	if (!title || !startDate || !startTime) {
		return controllerHelpers.formatApiResponse(400, res, new Error('[[cop-events:events.error_required]]'));
	}

	const startTs = parseDateTime(startDate, startTime);
	const endTs = (endDate && endTime) ? parseDateTime(endDate, endTime) : 0;

	// Handle banner upload
	let bannerUrl = event.bannerUrl;
	if (req.files && req.files.length) {
		const file = req.files[0];
		const saved = await storage.save({
			name: `${Date.now()}-${file.originalname}`,
			path: file.path,
		});
		bannerUrl = saved.url;
	}

	const updated = await events.update(req.params.eventId, {
		title, description, sector, region, location,
		startDate: startTs,
		endDate: endTs,
		meetingLink, meetingPlatform, registrationLink,
		bannerUrl: bannerUrl,
	});

	// Sync linked topic
	await eventTopics.updateEventTopic(updated);

	return controllerHelpers.formatApiResponse(200, res, {
		eventId: updated.eventId,
		slug: updated.slug,
		redirectUrl: `${nconf.get('relative_path')}/events/${updated.slug}`,
	});
};

controllers.handleDelete = async function (req, res) {
	if (!req.uid) {
		return controllerHelpers.formatApiResponse(401, res, new Error('[[error:not-logged-in]]'));
	}

	const event = await events.get(req.params.eventId);
	if (!event) {
		return controllerHelpers.formatApiResponse(404, res, new Error('[[error:not-found]]'));
	}

	const userCanEdit = await canEdit(req.uid, event);
	if (!userCanEdit) {
		return controllerHelpers.formatApiResponse(403, res, new Error('[[error:no-privileges]]'));
	}

	// Delete linked topic
	if (parseInt(event.tid, 10)) {
		await eventTopics.deleteEventTopic(event.tid, req.uid);
	}

	await events.delete(req.params.eventId);

	return controllerHelpers.formatApiResponse(200, res, {
		redirectUrl: `${nconf.get('relative_path')}/events`,
	});
};

controllers.handleRsvp = async function (req, res) {
	if (!req.uid) {
		return controllerHelpers.formatApiResponse(401, res, new Error('[[error:not-logged-in]]'));
	}

	const eventId = req.params.eventId;
	const event = await events.get(eventId);
	if (!event) {
		return controllerHelpers.formatApiResponse(404, res, new Error('[[error:not-found]]'));
	}

	const isRsvpd = await events.isRsvpd(eventId, req.uid);
	if (isRsvpd) {
		await events.removeRsvp(eventId, req.uid);
	} else {
		await events.addRsvp(eventId, req.uid);
	}

	const count = await events.getRsvpCount(eventId);

	return controllerHelpers.formatApiResponse(200, res, {
		rsvpd: !isRsvpd,
		count: count,
	});
};

controllers.apiCalendar = async function (req, res) {
	const now = new Date();
	const year = parseInt(req.query.year, 10) || now.getUTCFullYear();
	const month = parseInt(req.query.month, 10);
	const currentMonth = (isNaN(month) ? now.getUTCMonth() : month);

	const monthEvents = await events.getByMonth(year, currentMonth);

	return controllerHelpers.formatApiResponse(200, res, {
		year: year,
		month: currentMonth,
		events: monthEvents,
	});
};

// Admin controllers

controllers.admin = async function (req, res) {
	const settings = await getSettings();
	res.render('admin/plugins/cop-events', {
		title: '[[cop-events:admin.title]]',
		settings: settings,
	});
};

controllers.saveSettings = async function (req, res) {
	const { defaultCategory, requireApproval } = req.body;
	await meta.settings.set('cop-events', {
		defaultCategory: String(defaultCategory || '4'),
		requireApproval: requireApproval ? '1' : '0',
	});
	return controllerHelpers.formatApiResponse(200, res, { success: true });
};

// Helpers

function parseDateTime(dateStr, timeStr) {
	// dateStr: "2026-05-15", timeStr: "14:00"
	return new Date(`${dateStr}T${timeStr}:00Z`).getTime();
}

function buildCalendarGrid(year, month, monthEvents) {
	const firstDay = new Date(Date.UTC(year, month, 1));
	const lastDay = new Date(Date.UTC(year, month + 1, 0));
	const daysInMonth = lastDay.getUTCDate();

	// Monday = 0, Sunday = 6 (ISO week)
	let startDow = firstDay.getUTCDay() - 1;
	if (startDow < 0) startDow = 6;

	// Build event lookup by day number
	const eventsByDay = {};
	monthEvents.forEach((ev) => {
		const d = new Date(parseInt(ev.startDate, 10));
		const day = d.getUTCDate();
		if (!eventsByDay[day]) eventsByDay[day] = [];
		eventsByDay[day].push({
			title: ev.title,
			slug: ev.slug,
			sector: ev.sector,
		});
	});

	// Previous month days
	const prevMonth = month === 0 ? 11 : month - 1;
	const prevYear = month === 0 ? year - 1 : year;
	const prevMonthLastDay = new Date(Date.UTC(prevYear, prevMonth + 1, 0)).getUTCDate();

	const weeks = [];
	let currentDay = 1;
	let nextMonthDay = 1;

	for (let week = 0; week < 6; week++) {
		const days = [];
		for (let dow = 0; dow < 7; dow++) {
			const cellIndex = week * 7 + dow;
			if (cellIndex < startDow) {
				// Previous month
				days.push({
					dayNum: prevMonthLastDay - startDow + cellIndex + 1,
					isCurrentMonth: false,
					events: [],
				});
			} else if (currentDay <= daysInMonth) {
				days.push({
					dayNum: currentDay,
					isCurrentMonth: true,
					events: eventsByDay[currentDay] || [],
					hasEvent: !!(eventsByDay[currentDay] && eventsByDay[currentDay].length),
				});
				currentDay++;
			} else {
				// Next month
				days.push({
					dayNum: nextMonthDay,
					isCurrentMonth: false,
					events: [],
				});
				nextMonthDay++;
			}
		}
		weeks.push({ days: days });

		// Stop if we've placed all days and filled the week
		if (currentDay > daysInMonth && nextMonthDay > 1) break;
	}

	return weeks;
}
