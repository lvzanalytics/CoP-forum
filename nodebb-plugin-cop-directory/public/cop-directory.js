'use strict';

$(window).on('action:ajaxify.end', function () {
	if (ajaxify.data.template && ajaxify.data.template.name === 'directory') {
		initDirectory();
	}
	if (ajaxify.data.template && ajaxify.data.template.name === 'admin/plugins/cop-directory') {
		initAdmin();
	}
});

function initDirectory() {
	var $form = $('#directory-search-form');
	var $optOut = $('#directory-opt-out');

	// Auto-submit on filter change
	$form.find('select').on('change', function () {
		$form.find('input[name="page"]').val('1');
		$form.submit();
	});

	// Opt-out toggle
	$optOut.on('change', function () {
		var $status = $('#opt-out-status');
		fetch(config.relative_path + '/api/v3/plugins/cop-directory/opt-out', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'x-csrf-token': config.csrf_token,
			},
			credentials: 'same-origin',
		})
			.then(function (res) { return res.json(); })
			.then(function (data) {
				if (data && data.status && data.status.code === 'ok') {
					var optedOut = data.response.optedOut;
					$optOut.prop('checked', optedOut);
					if (optedOut) {
						$status.text('[[cop-directory:directory.opted_out]]');
						require(['translator'], function (translator) {
							translator.translate('[[cop-directory:directory.opted_out]]', function (translated) {
								$status.text(translated);
							});
						});
					} else {
						require(['translator'], function (translator) {
							translator.translate('[[cop-directory:directory.opted_in]]', function (translated) {
								$status.text(translated);
							});
						});
					}
				}
			})
			.catch(function () {
				// Revert checkbox on error
				$optOut.prop('checked', !$optOut.prop('checked'));
				require(['alerts'], function (alerts) {
					alerts.error('[[error:unknown-error]]');
				});
			});
	});
}

function initAdmin() {
	var $saveBtn = $('#save-directory-settings');

	$saveBtn.on('click', function () {
		var settings = {
			resultsPerPage: $('#resultsPerPage').val(),
			defaultSort: $('#defaultSort').val(),
			enableOptOut: $('#enableOptOut').is(':checked') ? '1' : '0',
		};

		fetch(config.relative_path + '/api/admin/plugins/cop-directory/settings', {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
				'x-csrf-token': config.csrf_token,
			},
			credentials: 'same-origin',
			body: JSON.stringify(settings),
		})
			.then(function (res) { return res.json(); })
			.then(function () {
				require(['alerts'], function (alerts) {
					alerts.success('[[admin/admin:changes-saved]]');
				});
			})
			.catch(function () {
				require(['alerts'], function (alerts) {
					alerts.error('[[error:unknown-error]]');
				});
			});
	});
}
