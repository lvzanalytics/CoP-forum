'use strict';

$('document').ready(function () {
	// Discussion summary — inline button in theme topic.tpl
	$(document).on('click', '[component="copai/summarize-btn"]', function () {
		const tid = $(this).attr('data-tid');
		if (!tid) return;

		const btn = $(this);
		const summaryContainer = $('[component="copai/summary"]');
		const loadingEl = $('[component="copai/summary-loading"]');

		btn.prop('disabled', true);
		loadingEl.removeClass('d-none');

		socket.emit('plugins.copai.summarizeTopic', { tid }, function (err, data) {
			loadingEl.addClass('d-none');
			btn.prop('disabled', false);

			if (err) {
				require(['alerts'], function (alerts) {
					alerts.error(err.message);
				});
				return;
			}
			if (data) {
				// Render or update summary inline
				if (summaryContainer.length) {
					summaryContainer.find('.cop-ai-summary-text').html(formatSummary(data));
				} else {
					// Create the summary container if it didn't exist
					const html =
						'<div component="copai/summary" class="mb-2">' +
						'<div class="d-flex align-items-center gap-2 mb-2">' +
						'<i class="fa fa-robot text-muted"></i>' +
						'<span class="fw-semibold small text-muted">[[cop-ai:summary_modal.title]]</span>' +
						'</div>' +
						'<div class="cop-ai-summary-text">' + formatSummary(data) + '</div>' +
						'</div>';
					btn.closest('.cop-ai-summary-section').prepend(html);
				}
				// Update button text to "refresh"
				btn.find('i').nextAll().remove();
				btn.append(' [[cop-ai:summary_modal.refresh]]');
			}
		});
	});

	// Catchup digest — button in theme categories.tpl opens modal
	$(document).on('click', '[component="copai/catchup-btn"]', function () {
		openCatchupModal();
	});

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
