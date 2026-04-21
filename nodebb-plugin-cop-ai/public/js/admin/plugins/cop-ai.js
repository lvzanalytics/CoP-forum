'use strict';

define('admin/plugins/cop-ai', ['settings', 'alerts'], function (settings, alerts) {
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
				container.html('<div class="alert alert-danger">[[cop-ai:admin.usage_error]]</div>');
				return;
			}

			var data = res.response;
			var hasData = (data.discussion && data.discussion.length) ||
				(data.document && data.document.length) ||
				(data.catchup && data.catchup.length);

			if (!hasData) {
				container.html('<div class="alert alert-info">[[cop-ai:admin.no_usage_data]]</div>');
				return;
			}

			var html = '';
			var sections = [
				{ key: 'discussion', label: '[[cop-ai:admin.tab_discussions]]' },
				{ key: 'document', label: '[[cop-ai:admin.tab_documents]]' },
				{ key: 'catchup', label: '[[cop-ai:admin.tab_digest]]' },
			];

			sections.forEach(function (section) {
				var entries = data[section.key];
				if (!entries || !entries.length) return;

				html += '<h6 class="fw-bold mt-3">' + section.label + '</h6>';
				html += '<table class="table table-sm table-striped"><thead><tr>';
				html += '<th>[[cop-ai:admin.date]]</th><th>[[cop-ai:admin.tokens]]</th>';
				html += '</tr></thead><tbody>';
				entries.forEach(function (entry) {
					html += '<tr><td>' + entry.date + '</td><td>' + Math.round(entry.tokens).toLocaleString() + '</td></tr>';
				});
				html += '</tbody></table>';
			});

			container.html(html);
		}).fail(function () {
			$('#copai-usage-stats').html('<div class="alert alert-danger">[[cop-ai:admin.usage_error]]</div>');
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
			if (!confirm('[[cop-ai:admin.clear_confirm]]')) return;

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
	};

	return ACP;
});
