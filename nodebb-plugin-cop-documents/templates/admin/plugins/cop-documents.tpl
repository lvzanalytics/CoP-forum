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

					<!-- Cloudflare R2 -->
					<h4>[[cop-documents:admin.r2_section]]</h4>
					<p class="text-muted">[[cop-documents:admin.r2_help]]</p>

					<div class="mb-3">
						<label class="form-label" for="r2AccountId">[[cop-documents:admin.r2_account_id]]</label>
						<input type="text" class="form-control" id="r2AccountId" name="r2AccountId" value="{settings.r2AccountId}">
					</div>

					<div class="mb-3">
						<label class="form-label" for="r2AccessKeyId">[[cop-documents:admin.r2_access_key]]</label>
						<input type="text" class="form-control" id="r2AccessKeyId" name="r2AccessKeyId" value="{settings.r2AccessKeyId}">
					</div>

					<div class="mb-3">
						<label class="form-label" for="r2SecretAccessKey">[[cop-documents:admin.r2_secret_key]]</label>
						<input type="password" class="form-control" id="r2SecretAccessKey" name="r2SecretAccessKey" value="{settings.r2SecretAccessKey}">
					</div>

					<div class="mb-3">
						<label class="form-label" for="r2Bucket">[[cop-documents:admin.r2_bucket]]</label>
						<input type="text" class="form-control" id="r2Bucket" name="r2Bucket" value="{settings.r2Bucket}">
					</div>

					<div class="mb-3">
						<label class="form-label" for="r2PublicUrl">[[cop-documents:admin.r2_public_url]]</label>
						<input type="text" class="form-control" id="r2PublicUrl" name="r2PublicUrl" value="{settings.r2PublicUrl}" placeholder="https://files.example.com">
					</div>

					<button type="button" class="btn btn-primary" id="save-cop-docs-settings">
						<i class="fa fa-save"></i> [[cop-documents:admin.save]]
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
