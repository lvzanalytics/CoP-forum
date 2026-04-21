'use strict';

$('document').ready(function () {
	// Discussion summary — topic thread tools
	$(window).on('action:topic.tools.load', function () {
		$('.copai-summarize-topic').on('click', summarizeTopic);
	});

	function summarizeTopic() {
		const tid = ajaxify.data.tid;
		require(['bootbox', 'alerts'], function (bootbox, alerts) {
			const modal = bootbox.dialog({
				title: '[[cop-ai:summary_modal.title]]',
				message: '<div class="copai-summary-container"><div class="text-center p-4"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p class="mt-2">[[cop-ai:summary_modal.loading]]</p></div></div>',
				size: 'large',
				buttons: {
					ok: {
						label: '[[global:close]]',
						className: 'btn-primary',
					},
				},
			});
			socket.emit('plugins.copai.summarizeTopic', { tid }, function (err, data) {
				if (err) {
					modal.find('.copai-summary-container').html(
						'<div class="alert alert-danger">' + err.message + '</div>'
					);
					return;
				}
				if (data) {
					modal.find('.copai-summary-container').html(
						'<div class="copai-summary-text">' + formatSummary(data) + '</div>'
					);
				} else {
					modal.find('.copai-summary-container').html(
						'<div class="alert alert-info">[[cop-ai:summary_modal.empty]]</div>'
					);
				}
			});
		});
	}

	// Document summary — on document view pages
	if (ajaxify.data.template && ajaxify.data.template.name === 'documents/view') {
		initDocumentSummary();
	}
	$(window).on('action:ajaxify.end', function () {
		if (ajaxify.data.template && ajaxify.data.template.name === 'documents/view') {
			initDocumentSummary();
		}
		if (ajaxify.data.template && ajaxify.data.template.name === 'categories') {
			initCatchupBanner();
		}
	});

	function initDocumentSummary() {
		const docId = ajaxify.data.document && ajaxify.data.document.docId;
		if (!docId) return;

		// Inject container after the description panel if not already present
		if ($('.copai-doc-summary-container').length) return;
		const anchor = $('.doc-description-panel');
		if (!anchor.length) return;
		const container = $('<div class="copai-doc-summary-container mb-4"></div>');
		anchor.after(container);

		$.get(config.relative_path + '/api/v3/plugins/cop-ai/documents/' + docId + '/summary', function (res) {
			if (res && res.response && res.response.summary) {
				renderDocSummary(container, res.response.summary);
			} else if (app.user.uid) {
				container.html(
					'<button class="btn btn-sm btn-outline-primary copai-generate-doc-summary">' +
					'<i class="fa fa-wand-magic-sparkles me-1"></i>[[cop-ai:doc_summary.generate]]' +
					'</button>'
				);
				container.find('.copai-generate-doc-summary').on('click', function () {
					const btn = $(this);
					btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin me-1"></i>[[cop-ai:doc_summary.generating]]');
					$.post(config.relative_path + '/api/v3/plugins/cop-ai/documents/' + docId + '/summarize', function (res) {
						if (res && res.response && res.response.summary) {
							renderDocSummary(container, res.response.summary);
						}
					}).fail(function (xhr) {
						require(['alerts'], function (alerts) {
							alerts.error(xhr.responseJSON && xhr.responseJSON.status ? xhr.responseJSON.status.message : 'Error');
						});
						btn.prop('disabled', false).html('<i class="fa fa-wand-magic-sparkles me-1"></i>[[cop-ai:doc_summary.generate]]');
					});
				});
			}
		});
	}

	function renderDocSummary(container, summary) {
		container.html(
			'<div class="copai-doc-summary card"><div class="card-body">' +
			'<h6 class="card-title"><i class="fa fa-robot me-1"></i>[[cop-ai:doc_summary.title]]</h6>' +
			'<p class="card-text">' + escapeHtml(summary) + '</p>' +
			'</div></div>'
		);
	}

	// Catch-up digest banner
	function initCatchupBanner() {
		if (!app.user.uid) return;

		$.get(config.relative_path + '/api/v3/plugins/cop-ai/catchup/eligible', function (res) {
			if (res && res.response && res.response.eligible) {
				showCatchupBanner();
			}
		});
	}

	function showCatchupBanner() {
		if ($('.copai-catchup-banner').length) return;

		const banner = $(
			'<div class="copai-catchup-banner alert alert-info alert-dismissible fade show mx-3 mt-3">' +
			'<i class="fa fa-clock-rotate-left me-2"></i>' +
			'[[cop-ai:catchup.banner_text]] ' +
			'<button class="btn btn-sm btn-primary ms-2 copai-catchup-btn">[[cop-ai:catchup.button]]</button>' +
			'<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
			'</div>'
		);

		$('#content').prepend(banner);

		banner.find('.copai-catchup-btn').on('click', function () {
			openCatchupModal();
		});
	}

	function openCatchupModal() {
		require(['bootbox'], function (bootbox) {
			const modal = bootbox.dialog({
				title: '[[cop-ai:catchup.modal_title]]',
				message: '<div class="copai-catchup-content"><div class="text-center p-4"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p class="mt-2">[[cop-ai:catchup.loading]]</p></div></div>',
				size: 'large',
				buttons: {
					ok: {
						label: '[[global:close]]',
						className: 'btn-primary',
					},
				},
			});

			$.get(config.relative_path + '/api/v3/plugins/cop-ai/catchup', function (res) {
				if (res && res.response && res.response.digest) {
					modal.find('.copai-catchup-content').html(
						'<div class="copai-digest-text">' + formatSummary(res.response.digest) + '</div>'
					);
				} else {
					modal.find('.copai-catchup-content').html(
						'<div class="alert alert-info">[[cop-ai:catchup.no_activity]]</div>'
					);
				}
			}).fail(function (xhr) {
				modal.find('.copai-catchup-content').html(
					'<div class="alert alert-danger">' +
					(xhr.responseJSON && xhr.responseJSON.status ? xhr.responseJSON.status.message : 'Error') +
					'</div>'
				);
			});
		});
	}

	function formatSummary(text) {
		// Convert markdown-like formatting to HTML
		return escapeHtml(text)
			.replace(/\n\n/g, '</p><p>')
			.replace(/\n/g, '<br>')
			.replace(/^/, '<p>')
			.replace(/$/, '</p>')
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/- (.+?)(<br>|<\/p>)/g, '<li>$1</li>$2');
	}

	function escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
});
