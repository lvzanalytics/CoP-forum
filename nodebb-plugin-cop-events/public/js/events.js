'use strict';

/* globals $, ajaxify, config, alerts, bootbox */

$(document).ready(function () {
	$(window).on('action:ajaxify.end', function () {
		var tpl = ajaxify.data.template && ajaxify.data.template.name;
		if (tpl === 'events/form') initForm();
		if (tpl === 'events/view') initView();
		if (tpl === 'events/calendar') initCalendar();
		if (tpl === 'events/list') initList();
	});
});

function initForm() {
	var $form = $('#event-edit-form');
	if (!$form.length) return;

	// Banner preview
	$('#event-banner').on('change', function () {
		var file = this.files && this.files[0];
		if (!file) return;
		var reader = new FileReader();
		reader.onload = function (e) {
			var $preview = $('#banner-preview');
			$preview.removeClass('d-none').find('img').attr('src', e.target.result);
		};
		reader.readAsDataURL(file);
	});

	$form.on('submit', function (e) {
		e.preventDefault();
		var formData = new FormData(this);
		var isNew = ajaxify.data.isNew;
		var eventId = ajaxify.data.event && ajaxify.data.event.eventId;

		var url = config.relative_path + '/api/v3/plugins/cop-events';
		var method = 'POST';
		if (!isNew && eventId) {
			url += '/' + eventId;
			method = 'PUT';
		}

		fetch(url, {
			method: method,
			headers: {
				'x-csrf-token': config.csrf_token,
			},
			body: formData,
		})
			.then(function (response) { return response.json(); })
			.then(function (data) {
				if (data.status && data.status.code === 'ok' && data.response) {
					ajaxify.go(data.response.redirectUrl.replace(config.relative_path + '/', ''));
				} else {
					var msg = (data.status && data.status.message) || 'Error';
					alerts.error(msg);
				}
			})
			.catch(function (err) {
				alerts.error(err.message || 'Error');
			});
	});
}

function initView() {
	var eventId = ajaxify.data.event && ajaxify.data.event.eventId;
	if (!eventId) return;

	// RSVP button
	$('[component="events/rsvp"]').on('click', function () {
		var $btn = $(this);
		fetch(config.relative_path + '/api/v3/plugins/cop-events/' + eventId + '/rsvp', {
			method: 'POST',
			headers: {
				'x-csrf-token': config.csrf_token,
				'Content-Type': 'application/json',
			},
		})
			.then(function (r) { return r.json(); })
			.then(function (data) {
				if (data.status && data.status.code === 'ok' && data.response) {
					var resp = data.response;
					$btn.toggleClass('btn-primary btn-outline-primary');
					var key = resp.rsvpd ? '[[cop-events:events.rsvp_cancel]]' : '[[cop-events:events.rsvp]]';
					var icon = resp.rsvpd ? 'fa-check' : 'fa-hand-paper-o';
					require(['translator'], function (translator) {
						translator.translate(key, function (translated) {
							$btn.html('<i class="fa ' + icon + ' me-2"></i> ' + translated);
						});
					});
					$('[component="events/rsvp-count"]').text(resp.count);
				}
			});
	});

	// Delete button
	$('[component="events/delete"]').on('click', function () {
		bootbox.confirm({
			message: '[[cop-events:events.delete_confirm]]',
			callback: function (result) {
				if (!result) return;
				fetch(config.relative_path + '/api/v3/plugins/cop-events/' + eventId, {
					method: 'DELETE',
					headers: {
						'x-csrf-token': config.csrf_token,
					},
				})
					.then(function (r) { return r.json(); })
					.then(function (data) {
						if (data.status && data.status.code === 'ok') {
							ajaxify.go('events');
						}
					});
			},
		});
	});

	// Social sharing
	var pageUrl = encodeURIComponent(window.location.href);
	var title = encodeURIComponent(ajaxify.data.event.title || '');
	$('[component="share/linkedin"]').attr('href', 'https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl);
	$('[component="share/twitter"]').attr('href', 'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + title);
	$('[component="share/facebook"]').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl);

	// Add to calendar (.ics download)
	$('[component="events/add-to-calendar"]').on('click', function () {
		var ev = ajaxify.data.event;
		var startDate = new Date(parseInt(ev.startDate, 10));
		var endDate = parseInt(ev.endDate, 10) ? new Date(parseInt(ev.endDate, 10)) : new Date(startDate.getTime() + 3600000);

		var ics = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'BEGIN:VEVENT',
			'DTSTART:' + formatICSDate(startDate),
			'DTEND:' + formatICSDate(endDate),
			'SUMMARY:' + (ev.title || ''),
			'DESCRIPTION:' + (ev.description || '').replace(/\n/g, '\\n'),
			'LOCATION:' + (ev.meetingLink || ev.location || ''),
			'END:VEVENT',
			'END:VCALENDAR',
		].join('\r\n');

		var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
		var link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = (ev.slug || 'event') + '.ics';
		link.click();
		URL.revokeObjectURL(link.href);
	});

	// Init tooltips
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	tooltipTriggerList.forEach(function (el) {
		new bootstrap.Tooltip(el);
	});
}

function initCalendar() {
	if (typeof bootstrap === 'undefined' || !bootstrap.Popover) return;

	// "+N more" opens a popover listing that day's full agenda (each event clickable)
	var triggers = [].slice.call(document.querySelectorAll('.calendar-cell [data-bs-toggle="popover"]'));
	var popovers = triggers.map(function (el) {
		var contentEl = el.parentNode.querySelector('.day-popover-content');
		return new bootstrap.Popover(el, {
			html: true,
			sanitize: false,
			trigger: 'click',
			placement: 'auto',
			container: 'body',
			customClass: 'calendar-day-popover',
			content: contentEl ? contentEl.innerHTML : '',
		});
	});
	if (!popovers.length) return;

	// Close any open day popover when clicking outside it
	function onDocClick(e) {
		triggers.forEach(function (el, i) {
			var pop = popovers[i];
			if (!pop || el.contains(e.target)) return;
			if (pop.tip && pop.tip.contains(e.target)) return;
			pop.hide();
		});
	}
	document.addEventListener('click', onDocClick);

	// Tidy up popovers + listener on navigation
	$(window).one('action:ajaxify.start', function () {
		document.removeEventListener('click', onDocClick);
		popovers.forEach(function (p) { try { p.dispose(); } catch (err) { /* noop */ } });
	});
}

function initList() {
	var searchTimer;
	var $search = $('[component="events/search"]');
	$search.on('keyup', function () {
		clearTimeout(searchTimer);
		var q = $(this).val();
		searchTimer = setTimeout(function () {
			var params = new URLSearchParams(window.location.search);
			if (q) {
				params.set('q', q);
			} else {
				params.delete('q');
			}
			params.delete('page');
			ajaxify.go('events?' + params.toString());
		}, 500);
	});
}

function formatICSDate(d) {
	return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}
