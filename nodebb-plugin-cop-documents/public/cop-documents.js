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

	// Version upload form
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

	// Edit document form
	initEditForm();

	// Image lightbox
	initLightbox();

	// PDF fallback: if <object> fails, the iframe inside handles it
	// No additional JS needed — browser handles this natively
}

function initEditForm() {
	var relativePath = config.relative_path;

	$('#edit-document-save').off('click').on('click', function () {
		var form = $('#edit-document-form');
		var docId = form.attr('data-doc-id');
		var saveBtn = $(this);

		var payload = {
			title: form.find('#edit-title').val(),
			author: form.find('#edit-author').val(),
			date: form.find('#edit-date').val(),
			description: form.find('#edit-description').val(),
			category: form.find('#edit-category').val(),
			tags: form.find('#edit-tags').val(),
			region: form.find('#edit-region').val(),
			sector: form.find('#edit-sector').val(),
			sourceOrg: form.find('#edit-sourceOrg').val(),
			pubDate: form.find('#edit-pubDate').val(),
			language: form.find('#edit-language').val(),
			access: form.find('#edit-access').val(),
		};

		saveBtn.prop('disabled', true);

		fetch(relativePath + '/api/v3/plugins/cop-documents/' + docId, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-csrf-token': config.csrf_token,
			},
			body: JSON.stringify(payload),
		})
			.then(function (res) { return res.json(); })
			.then(function (data) {
				saveBtn.prop('disabled', false);
				if (data.status && data.status.code === 'ok' && data.response) {
					require(['alerts', 'bootstrap'], function (alerts, bootstrap) {
						alerts.success('[[cop-documents:view.edit_success]]');
						var modalEl = document.getElementById('editDocumentModal');
						var modal = modalEl ? bootstrap.Modal.getInstance(modalEl) : null;
						if (modal) modal.hide();
						// Navigate to updated URL (slug may have changed)
						if (data.response.redirectUrl) {
							ajaxify.go(data.response.redirectUrl.replace(relativePath + '/', ''));
						} else {
							ajaxify.refresh();
						}
					});
				} else {
					var msg = (data.status && data.status.message) || 'Error';
					require(['alerts'], function (alerts) { alerts.error(msg); });
				}
			})
			.catch(function (err) {
				saveBtn.prop('disabled', false);
				require(['alerts'], function (alerts) { alerts.error(err.message || 'Error'); });
			});
	});
}

function initLightbox() {
	var lightbox = document.getElementById('docLightbox');
	if (!lightbox) return;

	var lightboxImg = lightbox.querySelector('.doc-lightbox-img');
	var closeBtn = lightbox.querySelector('.doc-lightbox-close');
	var backdrop = lightbox.querySelector('.doc-lightbox-backdrop');

	// Open lightbox on image click
	$(document).on('click', '[data-action="lightbox"]', function () {
		lightboxImg.src = this.src;
		lightboxImg.alt = this.alt;
		lightbox.classList.add('active');
		document.body.style.overflow = 'hidden';
	});

	function closeLightbox() {
		lightbox.classList.remove('active');
		document.body.style.overflow = '';
	}

	if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
	if (backdrop) backdrop.addEventListener('click', closeLightbox);

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && lightbox.classList.contains('active')) {
			closeLightbox();
		}
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

function handleDownload() {
	// Let the browser follow the <a href> natively — just fire-and-forget the counter increment
	var docId = $(this).attr('data-doc-id');
	fetch(config.relative_path + '/api/v3/plugins/cop-documents/' + docId + '/download', {
		headers: { 'x-csrf-token': config.csrf_token },
	}).catch(function () {});
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
				require(['alerts'], function (alerts) { alerts.success('[[cop-documents:moderation.approve_success]]'); });
				ajaxify.refresh();
			}
		});
}

function handleReject() {
	var relativePath = config.relative_path;
	var docId = $(this).attr('data-doc-id');

	require(['translator'], function (translator) {
		translator.translate('[[cop-documents:moderation.reject_reason]]', function (translated) {
			var reason = prompt(translated);
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
						require(['alerts'], function (alerts) { alerts.success('[[cop-documents:moderation.reject_success]]'); });
						ajaxify.refresh();
					}
				});
		});
	});
}

function handleDelete() {
	var relativePath = config.relative_path;
	var docId = $(this).attr('data-doc-id');

	require(['translator'], function (translator) {
		translator.translate('[[cop-documents:moderation.delete_confirm]]', function (translated) {
			if (!confirm(translated)) return;

			fetch(relativePath + '/api/v3/plugins/cop-documents/' + docId, {
				method: 'DELETE',
				headers: {
					'x-csrf-token': config.csrf_token,
				},
			})
				.then(function (res) { return res.json(); })
				.then(function (data) {
					if (data.status && data.status.code === 'ok') {
						require(['alerts'], function (alerts) { alerts.success('[[cop-documents:moderation.delete_success]]'); });
						ajaxify.go('documents');
					}
				});
		});
	});
}
