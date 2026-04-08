import * as alerts from 'alerts';
import { translate } from 'translator';

const btnLabel = '<i class="fa fa-refresh me-1"></i> ';

export function init() {
	const backfillBtn = document.getElementById('backfill');

	// Cache the translated button label on load
	let translatedBtnLabel = '';
	translate('[[cop-events:admin.backfill_btn]]', function (text) {
		translatedBtnLabel = text;
	});

	document.getElementById('save').addEventListener('click', function () {
		const data = {
			defaultCategory: document.getElementById('defaultCategory').value,
			requireApproval: document.getElementById('requireApproval').checked ? '1' : '',
		};
		fetch(config.relative_path + '/api/admin/plugins/cop-events', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-csrf-token': config.csrf_token,
			},
			body: JSON.stringify(data),
		})
			.then(function (r) { return r.json(); })
			.then(function () {
				translate('[[cop-events:admin.saved]]', function (text) {
					alerts.success(text);
				});
			});
	});

	backfillBtn.addEventListener('click', function () {
		backfillBtn.disabled = true;
		backfillBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-1"></i> ...';
		fetch(config.relative_path + '/api/admin/plugins/cop-events/backfill', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-csrf-token': config.csrf_token,
			},
		})
			.then(function (r) { return r.json(); })
			.then(function (data) {
				backfillBtn.disabled = false;
				backfillBtn.innerHTML = btnLabel + translatedBtnLabel;
				const resultEl = document.getElementById('backfill-result');
				const count = (data.response && data.response.created) || 0;
				translate('[[cop-events:admin.backfill_result, ' + count + ']]', function (text) {
					resultEl.textContent = text;
					resultEl.classList.remove('d-none');
					alerts.success(text);
				});
			})
			.catch(function () {
				backfillBtn.disabled = false;
				backfillBtn.innerHTML = btnLabel + translatedBtnLabel;
			});
	});
}
