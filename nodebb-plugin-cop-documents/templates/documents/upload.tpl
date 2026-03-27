<div class="documents-upload">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-8">
				<h2 class="fw-semibold tracking-tight mb-4">[[cop-documents:upload.title]]</h2>

				<div id="upload-alerts"></div>

				<form id="doc-upload-form" enctype="multipart/form-data">
					<!-- File -->
					<div class="mb-3">
						<label class="form-label" for="doc-file">[[cop-documents:upload.file]] <span class="text-danger">*</span></label>
						<input type="file" class="form-control" id="doc-file" name="file" required>
					</div>

					<!-- Title -->
					<div class="mb-3">
						<label class="form-label" for="doc-title">[[cop-documents:upload.doc_title]] <span class="text-danger">*</span></label>
						<input type="text" class="form-control" id="doc-title" name="title" required>
					</div>

					<!-- Author -->
					<div class="mb-3">
						<label class="form-label" for="doc-author">[[cop-documents:upload.author]] <span class="text-danger">*</span></label>
						<input type="text" class="form-control" id="doc-author" name="author" required>
					</div>

					<!-- Date -->
					<div class="mb-3">
						<label class="form-label" for="doc-date">[[cop-documents:upload.date]] <span class="text-danger">*</span></label>
						<input type="date" class="form-control" id="doc-date" name="date" required>
					</div>

					<!-- Description -->
					<div class="mb-3">
						<label class="form-label" for="doc-description">[[cop-documents:upload.description]] <span class="text-danger">*</span></label>
						<textarea class="form-control" id="doc-description" name="description" rows="4" minlength="50" required></textarea>
						<div class="form-text">[[cop-documents:upload.description_help]]</div>
					</div>

					<!-- Category -->
					<div class="mb-3">
						<label class="form-label" for="doc-category">[[cop-documents:upload.category]] <span class="text-danger">*</span></label>
						<select class="form-select" id="doc-category" name="category" required>
							<option value="">--</option>
							{{{each categoryOptions}}}
							<option value="{./value}">{./label}</option>
							{{{end}}}
						</select>
					</div>

					<!-- Tags -->
					<div class="mb-3">
						<label class="form-label" for="doc-tags">[[cop-documents:upload.tags]] <span class="text-danger">*</span></label>
						<input type="text" class="form-control" id="doc-tags" name="tags" required>
						<div class="form-text">[[cop-documents:upload.tags_help]]</div>
					</div>

					<!-- Region -->
					<div class="mb-3">
						<label class="form-label" for="doc-region">[[cop-documents:upload.region]]</label>
						<input type="text" class="form-control" id="doc-region" name="region">
					</div>

					<!-- Sector -->
					<div class="mb-3">
						<label class="form-label" for="doc-sector">[[cop-documents:upload.sector]]</label>
						<input type="text" class="form-control" id="doc-sector" name="sector">
					</div>

					<!-- Source Org -->
					<div class="mb-3">
						<label class="form-label" for="doc-source-org">[[cop-documents:upload.source_org]]</label>
						<input type="text" class="form-control" id="doc-source-org" name="sourceOrg">
					</div>

					<!-- Publication Date -->
					<div class="mb-3">
						<label class="form-label" for="doc-pub-date">[[cop-documents:upload.pub_date]]</label>
						<input type="date" class="form-control" id="doc-pub-date" name="pubDate">
					</div>

					<!-- Language -->
					<div class="mb-3">
						<label class="form-label" for="doc-language">[[cop-documents:upload.language]]</label>
						<select class="form-select" id="doc-language" name="language">
							<option value="fr" selected>Fran&ccedil;ais</option>
							<option value="en">English</option>
						</select>
					</div>

					<!-- Access Level -->
					<div class="mb-3">
						<label class="form-label" for="doc-access">[[cop-documents:upload.access]]</label>
						<select class="form-select" id="doc-access" name="access">
							<option value="public">[[cop-documents:upload.access_public]]</option>
							<option value="members">[[cop-documents:upload.access_members]]</option>
						</select>
					</div>

					<button type="submit" class="btn btn-primary" id="doc-submit-btn">
						<i class="fa fa-paper-plane"></i> [[cop-documents:upload.submit]]
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
