<div class="acp-page-container">
	<div class="col-lg-9">
		<div class="row">
			<div class="col-12">
				<h3>[[cop-documents:admin.title]]</h3>
				<hr />

				<form id="cop-documents-settings" role="form">
					<!-- Max File Size -->
					<div class="mb-3">
						<label class="form-label" for="maxFileSize">[[cop-documents:admin.max_file_size]]</label>
						<input type="number" class="form-control" id="maxFileSize" name="maxFileSize" value="{settings.maxFileSize}" min="1" max="100">
					</div>

					<!-- Allowed Extensions -->
					<div class="mb-3">
						<label class="form-label" for="allowedExtensions">[[cop-documents:admin.allowed_extensions]]</label>
						<input type="text" class="form-control" id="allowedExtensions" name="allowedExtensions" value="{settings.allowedExtensions}">
					</div>

					<!-- Auto Approve Categories -->
					<div class="mb-3">
						<label class="form-label">[[cop-documents:admin.auto_approve]]</label>
						{{{each categoryOptions}}}
						<div class="form-check">
							<input class="form-check-input auto-approve-check" type="checkbox" value="{./value}" id="auto-{./value}" {{{ if ./checked }}}checked{{{ end }}}>
							<label class="form-check-label" for="auto-{./value}">{./label}</label>
						</div>
						{{{end}}}
					</div>

					<hr />
					<p class="text-muted"><i class="fa fa-info-circle"></i> [[cop-documents:admin.r2_shared_note]]</p>

					<button type="button" class="btn btn-primary" id="save-cop-docs-settings">
						<i class="fa fa-save"></i> [[cop-documents:admin.save]]
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
