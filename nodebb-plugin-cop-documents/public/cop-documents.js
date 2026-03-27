'use strict';

function showAlert(el, msg) {
	require(['translator'], function (translator) {
		translator.translate(msg, function (translated) {
			el.html('<div class="alert alert-danger">' + translated + '</div>');
		});
	});
}

$(window).on('action:ajaxify.end', function () {
	var tpl = ajaxify.data.template && ajaxify.data.template.name;
	if (tpl === 'documents/upload') {
		initUpload();
	}
	if (tpl === 'documents/view') {
		initView();
	}
	if (tpl === 'admin/plugins/cop-documents') {
		initAdmin();
	}
});

// Delegated handlers for buttons that appear on multiple pages
$(document).on('click', '.doc-download-btn', handleDownload);
$(document).on('click', '.doc-approve-btn', handleApprove);
$(document).on('click', '.doc-reject-btn', handleReject);
$(document).on('click', '.doc-delete-btn', handleDelete);

function initUpload() {
	var relativePath = config.relative_path;

	$('#doc-upload-form').off('submit').on('submit', function (e) {
		e.preventDefault();
		var form = this;
		var formData = new FormData(form);
		var submitBtn = $('#doc-submit-btn');
		var alertsEl = $('#upload-alerts');

		alertsEl.empty();
		submitBtn.prop('disabled', true);

		fetch(relativePath + '/api/v3/plugins/cop-documents/upload', {
			method: 'POST',
			headers: {
				'x-csrf-token': config.csrf_token,
			},
			body: formData,
		})
			.then(function (res) {
				if (!res.ok && res.headers.get('content-type') && res.headers.get('content-type').indexOf('json') === -1) {
					throw new Error('Server returned ' + res.status);
				}
				return res.json();
			})
			.then(function (data) {
				submitBtn.prop('disabled', false);
				if (data.status && data.status.code === 'ok' && data.response) {
					require(['alerts'], function (alerts) { alerts.success('[[cop-documents:upload.success]]'); });
					if (data.response.redirectUrl) {
						ajaxify.go(data.response.redirectUrl.replace(relativePath + '/', ''));
					}
				} else {
					var msg = (data.status && data.status.message) || 'Error';
					showAlert(alertsEl, msg);
				}
			})
			.catch(function (err) {
				submitBtn.prop('disabled', false);
				showAlert(alertsEl, err.message || 'Error');
			});
	});
}

function initView() {
	var relativePath = config.relative_path;

	$('#version-upload-form').off('submit').on('submit', function (e) {
		e.preventDefault();
		var form = this;
		var docId = $(form).attr('data-doc-id');
		var formData = new FormData(form);

		fetch(relativePath + '/api/v3/plugins/cop-documents/' + docId + '/version', {
			method: 'POST',
			headers: {
				'x-csrf-token': config.csrf_token,
			},
			body: formData,
		})
			.then(function (res) { return res.json(); })
			.then(function (data) {
				if (data.status && data.status.code === 'ok') {
					require(['alerts'], function (alerts) { alerts.success('[[cop-documents:upload.success]]'); });
					ajaxify.refresh();
				} else {
					var msg = (data.status && data.status.message) || 'Error';
					require(['alerts'], function (alerts) { alerts.error(msg); });
				}
			})
			.catch(function () {
				require(['alerts'], function (alerts) { alerts.error('Error'); });
			});
	});
}

function initAdmin() {
	var relativePath = config.relative_path;

	$('#save-cop-docs-settings').off('click').on('click', function () {
		var form = $('#cop-documents-settings');
		var autoApprove = [];
		form.find('.auto-approve-check:checked').each(function () {
			autoApprove.push($(this).val());
		});

		var settings = {
			maxFileSize: form.find('#maxFileSize').val(),
			allowedExtensions: form.find('#allowedExtensions').val(),
			autoApproveCategories: autoApprove.join(','),
			r2AccountId: form.find('#r2AccountId').val(),
			r2AccessKeyId: form.find('#r2AccessKeyId').val(),
			r2SecretAccessKey: form.find('#r2SecretAccessKey').val(),
			r2Bucket: form.find('#r2Bucket').val(),
			r2PublicUrl: form.find('#r2PublicUrl').val(),
		};

		fetch(relativePath + '/api/admin/plugins/cop-documents', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-csrf-token': config.csrf_token,
			},
			body: JSON.stringify(settings),
		})
			.then(function (res) { return res.json(); })
			.then(function () {
				require(['alerts'], function (alerts) { alerts.success('Saved'); });
			});
	});
}

function handleDownload(e) {
	e.preventDefault();
	var relativePath = config.relative_path;
	var docId = $(this).attr('data-doc-id');
	var fileUrl = $(this).attr('data-file-url');

	fetch(relativePath + '/api/v3/plugins/cop-documents/' + docId + '/download', {
		headers: {
			'x-csrf-token': config.csrf_token,
		},
	})
		.then(function (res) { return res.json(); })
		.then(function (data) {
			if (data.status && data.status.code === 'ok' && data.response && data.response.url) {
				var url = data.response.url;
				window.open(url.startsWith('http') ? url : relativePath + url, '_blank');
			} else if (fileUrl) {
				window.open(fileUrl.startsWith('http') ? fileUrl : relativePath + fileUrl, '_blank');
			}
		})
		.catch(function () {
			if (fileUrl) {
				window.open(fileUrl.startsWith('http') ? fileUrl : relativePath + fileUrl, '_blank');
			}
		});
}

function handleApprove() {
	var relativePath = config.relative_path;
	var docId = $(this).attr('data-doc-id');
	fetch(relativePath + '/api/v3/plugins/cop-documents/' + docId + '/approve', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-csrf-token': config.csrf_token,
		},
	})
		.then(function (res) { return res.json(); })
		.then(function (data) {
			if (data.status && data.status.code === 'ok') {
				require(['alerts'], function (alerts) { alerts.success('[[cop-documents:view.status_approved]]'); });
				ajaxify.refresh();
			}
		});
}

function handleReject() {
	var relativePath = config.relative_path;
	var docId = $(this).attr('data-doc-id');
	var reason = prompt('[[cop-documents:moderation.reject_reason]]');
	if (!reason) return;

	fetch(relativePath + '/api/v3/plugins/cop-documents/' + docId + '/reject', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-csrf-token': config.csrf_token,
		},
		body: JSON.stringify({ reason: reason }),
	})
		.then(function (res) { return res.json(); })
		.then(function (data) {
			if (data.status && data.status.code === 'ok') {
				require(['alerts'], function (alerts) { alerts.success('[[cop-documents:view.status_rejected]]'); });
				ajaxify.refresh();
			}
		});
}

function handleDelete() {
	var relativePath = config.relative_path;
	var docId = $(this).attr('data-doc-id');
	if (!confirm('[[cop-documents:moderation.delete]]?')) return;

	fetch(relativePath + '/api/v3/plugins/cop-documents/' + docId, {
		method: 'DELETE',
		headers: {
			'x-csrf-token': config.csrf_token,
		},
	})
		.then(function (res) { return res.json(); })
		.then(function (data) {
			if (data.status && data.status.code === 'ok') {
				require(['alerts'], function (alerts) { alerts.success('OK'); });
				ajaxify.go('documents');
			}
		});
}
