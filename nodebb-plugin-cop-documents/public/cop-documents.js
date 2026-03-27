'use strict';

$(document).ready(function () {
	var relativePath = config.relative_path;

	// Upload form submission
	$('#doc-upload-form').on('submit', function (e) {
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
			.then(function (res) { return res.json(); })
			.then(function (data) {
				submitBtn.prop('disabled', false);
				if (data.status && data.status.code === 'ok' && data.response) {
					app.alertSuccess('[[cop-documents:upload.success]]');
					if (data.response.redirectUrl) {
						ajaxify.go(data.response.redirectUrl.replace(relativePath + '/', ''));
					}
				} else {
					var msg = (data.status && data.status.message) || '[[cop-documents:upload.error_required]]';
					alertsEl.html('<div class="alert alert-danger">' + msg + '</div>');
				}
			})
			.catch(function () {
				submitBtn.prop('disabled', false);
				alertsEl.html('<div class="alert alert-danger">[[cop-documents:upload.error_required]]</div>');
			});
	});

	// Download button
	$(document).on('click', '.doc-download-btn', function (e) {
		e.preventDefault();
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
					window.open(relativePath + data.response.url, '_blank');
				} else if (fileUrl) {
					window.open(relativePath + fileUrl, '_blank');
				}
			})
			.catch(function () {
				if (fileUrl) {
					window.open(relativePath + fileUrl, '_blank');
				}
			});
	});

	// Approve button
	$(document).on('click', '.doc-approve-btn', function () {
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
					app.alertSuccess('[[cop-documents:view.status_approved]]');
					ajaxify.refresh();
				}
			});
	});

	// Reject button
	$(document).on('click', '.doc-reject-btn', function () {
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
					app.alertSuccess('[[cop-documents:view.status_rejected]]');
					ajaxify.refresh();
				}
			});
	});

	// Delete button
	$(document).on('click', '.doc-delete-btn', function () {
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
					app.alertSuccess('OK');
					ajaxify.go('documents');
				}
			});
	});

	// Version upload form
	$('#version-upload-form').on('submit', function (e) {
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
					app.alertSuccess('[[cop-documents:upload.success]]');
					ajaxify.refresh();
				} else {
					var msg = (data.status && data.status.message) || 'Error';
					app.alertError(msg);
				}
			})
			.catch(function () {
				app.alertError('Error');
			});
	});

	// Admin settings save
	$('#save-cop-docs-settings').on('click', function () {
		var form = $('#cop-documents-settings');
		var autoApprove = [];
		form.find('.auto-approve-check:checked').each(function () {
			autoApprove.push($(this).val());
		});

		var settings = {
			maxFileSize: form.find('#maxFileSize').val(),
			allowedExtensions: form.find('#allowedExtensions').val(),
			storageBackend: form.find('#storageBackend').val(),
			autoApproveCategories: autoApprove.join(','),
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
				app.alertSuccess('Saved');
			});
	});
});
