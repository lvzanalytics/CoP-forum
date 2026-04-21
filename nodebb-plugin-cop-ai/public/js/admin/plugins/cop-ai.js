'use strict';

define('admin/plugins/cop-ai', ['settings', 'alerts', 'translator'], function (settings, alerts, translator) {
	var ACP = {};

	function toggleProviderFields() {
		var provider = $('#provider').val();
		var loginMethod = $('#loginMethod').val();
		var isAgentSDK = provider === 'agent-sdk';

		$('#loginMethodGroup').toggle(isAgentSDK);
		$('#apiBaseUrlGroup').toggle(!isAgentSDK);

		if (isAgentSDK && loginMethod === 'claudeai') {
			$('#apiKeyGroup').hide();
		} else {
			$('#apiKeyGroup').show();
		}
	}

	function loadCacheCounts() {
		$.get(config.relative_path + '/api/v3/plugins/cop-ai/cache/counts', function (res) {
			if (res && res.response) {
				$('#copai-count-discussions').text(res.response.discussions || 0);
				$('#copai-count-documents').text(res.response.documents || 0);
				$('#copai-count-digests').text(res.response.digests || 0);
				$('#copai-count-ratelimits').text(res.response.rateLimitKeys || 0);
			}
		});
	}

	function loadUsageStats() {
		$.get(config.relative_path + '/api/v3/plugins/cop-ai/usage', function (res) {
			var container = $('#copai-usage-stats');
			if (!res || !res.response) {
				translator.translate('[[cop-ai:admin.usage_error]]', function (t) {
					container.html('<div class="alert alert-danger">' + t + '</div>');
				});
				return;
			}

			var data = res.response;
			var hasData = (data.discussion && data.discussion.length) ||
				(data.document && data.document.length) ||
				(data.catchup && data.catchup.length);

			if (!hasData) {
				translator.translate('[[cop-ai:admin.no_usage_data]]', function (t) {
					container.html('<div class="alert alert-info">' + t + '</div>');
				});
				return;
			}

			var sections = [
				{ key: 'discussion', labelKey: '[[cop-ai:admin.tab_discussions]]' },
				{ key: 'document', labelKey: '[[cop-ai:admin.tab_documents]]' },
				{ key: 'catchup', labelKey: '[[cop-ai:admin.tab_digest]]' },
			];

			// Translate all labels at once
			var allKeys = sections.map(function (s) { return s.labelKey; });
			allKeys.push('[[cop-ai:admin.date]]', '[[cop-ai:admin.tokens]]');
			translator.translate(allKeys.join('|'), function (translated) {
				var parts = translated.split('|');
				var html = '';

				sections.forEach(function (section, i) {
					var entries = data[section.key];
					if (!entries || !entries.length) return;

					html += '<h6 class="fw-bold mt-3">' + parts[i] + '</h6>';
					html += '<table class="table table-sm table-striped"><thead><tr>';
					html += '<th>' + parts[3] + '</th><th>' + parts[4] + '</th>';
					html += '</tr></thead><tbody>';
					entries.forEach(function (entry) {
						html += '<tr><td>' + entry.date + '</td><td>' + Math.round(entry.tokens).toLocaleString() + '</td></tr>';
					});
					html += '</tbody></table>';
				});

				container.html(html);
			});
		}).fail(function () {
			translator.translate('[[cop-ai:admin.usage_error]]', function (t) {
				$('#copai-usage-stats').html('<div class="alert alert-danger">' + t + '</div>');
			});
		});
	}

	ACP.init = function () {
		settings.load('cop-ai', $('.cop-ai-settings'), function () {
			toggleProviderFields();
		});

		$('#provider').on('change', toggleProviderFields);
		$('#loginMethod').on('change', toggleProviderFields);

		$('#save').on('click', function () {
			settings.save('cop-ai', $('.cop-ai-settings'), function () {
				alerts.alert({
					type: 'success',
					alert_id: 'cop-ai-saved',
					title: '[[cop-ai:admin.saved]]',
				});
			});
		});

		// Load usage stats and cache counts when Usage tab is shown
		$('a[href="#tab-usage"]').on('shown.bs.tab', function () {
			loadUsageStats();
			loadCacheCounts();
		});

		// Cache clear buttons
		$('.copai-clear-btn').on('click', function () {
			var btn = $(this);
			var type = btn.data('type');

			translator.translate('[[cop-ai:admin.clear_confirm]]', function (t) {
				if (!confirm(t)) return;

				btn.prop('disabled', true);
				$.ajax({
					url: config.relative_path + '/api/v3/plugins/cop-ai/cache/' + type,
					method: 'DELETE',
				}).done(function () {
					alerts.alert({
						type: 'success',
						alert_id: 'cop-ai-cleared',
						title: '[[cop-ai:admin.cleared]]',
					});
					loadCacheCounts();
				}).fail(function () {
					alerts.error('Error');
				}).always(function () {
					btn.prop('disabled', false);
				});
			});
		});
	};

	return ACP;
});
