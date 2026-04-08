<div class="acp-page-container">
	<div class="row m-0">
		<div id="container" class="col-12 p-0">
			<div class="card border-0 shadow-sm mb-3">
				<div class="card-header bg-white py-3">
					<h5 class="fw-bold mb-0">[[cop-events:admin.title]]</h5>
				</div>
				<div class="card-body">
					<form role="form" class="cop-events-settings">
						<div class="row">
							<div class="col-sm-6 col-12">
								<div class="mb-3">
									<label class="form-label" for="defaultCategory">[[cop-events:admin.default_category]]</label>
									<select id="defaultCategory" name="defaultCategory" class="form-select">
										{{{ each categoryOptions }}}
										<option value="{../cid}" {{{ if ../selected }}}selected{{{ end }}}>{../name}</option>
										{{{ end }}}
									</select>
									<p class="form-text">[[cop-events:admin.default_category_help]]</p>
								</div>
								<div class="mb-3">
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" id="requireApproval" name="requireApproval" {{{ if settings.requireApproval }}}checked{{{ end }}} />
										<label class="form-check-label" for="requireApproval">[[cop-events:admin.require_approval]]</label>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>

			<div class="card border-0 shadow-sm">
				<div class="card-header bg-white py-3">
					<h5 class="fw-bold mb-0">[[cop-events:admin.tools]]</h5>
				</div>
				<div class="card-body">
					<p class="text-muted mb-3">[[cop-events:admin.backfill_desc]]</p>
					<button id="backfill" class="btn btn-outline-primary">
						<i class="fa fa-refresh me-1"></i> [[cop-events:admin.backfill_btn]]
					</button>
					<span id="backfill-result" class="ms-2 text-success d-none"></span>
				</div>
			</div>
		</div>
	</div>
</div>

<button id="save" class="floating-button btn btn-primary shadow-lg rounded-circle">
	<i class="fa fa-save"></i>
</button>

<script>
	require(['settings'], function (settings) {
		document.getElementById('save').addEventListener('click', function () {
			var data = {
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
					require(['alerts'], function (alerts) {
						alerts.success('[[cop-events:admin.saved]]');
					});
				});
		});

		document.getElementById('backfill').addEventListener('click', function () {
			var btn = this;
			btn.disabled = true;
			btn.innerHTML = '<i class="fa fa-spinner fa-spin me-1"></i> ...';
			fetch(config.relative_path + '/api/admin/plugins/cop-events/backfill', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-csrf-token': config.csrf_token,
				},
			})
				.then(function (r) { return r.json(); })
				.then(function (data) {
					btn.disabled = false;
					btn.innerHTML = '<i class="fa fa-refresh me-1"></i> [[cop-events:admin.backfill_btn]]';
					var result = document.getElementById('backfill-result');
					if (data.response) {
						result.textContent = data.response.message;
						result.classList.remove('d-none');
					}
					require(['alerts'], function (alerts) {
						alerts.success(data.response ? data.response.message : 'Done');
					});
				})
				.catch(function () {
					btn.disabled = false;
					btn.innerHTML = '<i class="fa fa-refresh me-1"></i> [[cop-events:admin.backfill_btn]]';
				});
		});
	});
</script>
