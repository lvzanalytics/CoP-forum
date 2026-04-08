<div class="acp-page-container">
	<div class="row m-0">
		<div id="container" class="col-12 p-0">
			<div class="card border-0 shadow-sm">
				<div class="card-header bg-white py-3">
					<h5 class="fw-bold mb-0">[[cop-events:admin.title]]</h5>
				</div>
				<div class="card-body">
					<form role="form" class="cop-events-settings">
						<div class="row">
							<div class="col-sm-6 col-12">
								<div class="mb-3">
									<label class="form-label" for="defaultCategory">[[cop-events:admin.default_category]]</label>
									<input type="number" id="defaultCategory" name="defaultCategory" title="ID de la catégorie" class="form-control" placeholder="4" value="{settings.defaultCategory}" />
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
		</div>
	</div>
</div>

<button id="save" class="floating-button btn btn-primary shadow-lg rounded-circle">
	<i class="fa fa-save"></i>
</button>

<script>
	require(['settings'], function (settings) {
		var wrapper = document.querySelector('.cop-events-settings');
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
	});
</script>
