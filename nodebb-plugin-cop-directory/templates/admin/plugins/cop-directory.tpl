<div class="acp-page-container">
	<div class="col-lg-9">
		<div class="card">
			<div class="card-header">
				<h5 class="mb-0">[[cop-directory:admin.title]]</h5>
			</div>
			<div class="card-body">
				<form id="cop-directory-settings" role="form">
					<div class="mb-3">
						<label class="form-label" for="resultsPerPage">[[cop-directory:admin.results_per_page]]</label>
						<input type="number" class="form-control" id="resultsPerPage" name="resultsPerPage" value="{settings.resultsPerPage}" min="5" max="100" />
					</div>

					<div class="mb-3">
						<label class="form-label" for="defaultSort">[[cop-directory:admin.default_sort]]</label>
						<select class="form-select" id="defaultSort" name="defaultSort">
							<option value="name" {{{ if (settings.defaultSort == "name") }}}selected{{{ end }}}>[[cop-directory:directory.sort_name]]</option>
							<option value="newest" {{{ if (settings.defaultSort == "newest") }}}selected{{{ end }}}>[[cop-directory:directory.sort_newest]]</option>
						</select>
					</div>

					<div class="mb-3">
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" id="enableOptOut" name="enableOptOut" {{{ if settings.enableOptOut }}}checked{{{ end }}} />
							<label class="form-check-label" for="enableOptOut">[[cop-directory:admin.enable_opt_out]]</label>
						</div>
					</div>

					<button type="button" class="btn btn-primary" id="save-directory-settings">
						<i class="fa fa-save me-1"></i>[[cop-directory:admin.save]]
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
