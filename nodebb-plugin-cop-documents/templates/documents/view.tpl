<div class="documents-view">
	<div class="container">
		<!-- Breadcrumb -->
		<nav aria-label="breadcrumb" class="mb-3">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="{config.relative_path}/documents">[[cop-documents:view.breadcrumb_library]]</a></li>
				<li class="breadcrumb-item active" aria-current="page">{document.title}</li>
			</ol>
		</nav>

		<!-- Hero Section -->
		<div class="doc-hero mb-4">
			<div class="d-flex align-items-start gap-3">
				<div class="doc-hero-icon flex-shrink-0">
					<i class="fa fa-file-{{{ if (previewType == "pdf") }}}pdf-o{{{ else }}}{{{ if (previewType == "image") }}}image-o{{{ else }}}o{{{ end }}}{{{ end }}} fa-3x"></i>
				</div>
				<div class="flex-grow-1 min-width-0">
					<h1 class="doc-hero-title fw-bold mb-2">{document.title}</h1>
					<div class="doc-hero-meta d-flex flex-wrap align-items-center gap-2 mb-3">
						<span class="text-muted">{document.author}</span>
						<span class="text-muted">&middot;</span>
						<span class="text-muted">{document.date}</span>
						<span class="badge doc-category-badge">{document.categoryLabel}</span>
						{{{ if (document.status == "approved") }}}
						<span class="badge bg-success">[[cop-documents:view.status_approved]]</span>
						{{{ end }}}
						{{{ if (document.status == "pending") }}}
						<span class="badge bg-warning text-dark">[[cop-documents:view.status_pending]]</span>
						{{{ end }}}
						{{{ if (document.status == "rejected") }}}
						<span class="badge bg-danger">[[cop-documents:view.status_rejected]]</span>
						{{{ end }}}
					</div>
					<div class="doc-hero-actions d-flex flex-wrap gap-2">
						<a href="{document.fileUrl}" target="_blank" rel="noopener" class="btn btn-primary doc-download-btn" data-doc-id="{document.docId}">
							<i class="fa fa-download"></i> <span class="d-none d-sm-inline">[[cop-documents:view.download]]</span>
						</a>
						{{{ if canEdit }}}
						<button class="btn btn-outline-secondary doc-edit-btn" data-bs-toggle="modal" data-bs-target="#editDocumentModal">
							<i class="fa fa-pencil"></i> <span class="d-none d-sm-inline">[[cop-documents:view.edit_btn]]</span>
						</button>
						{{{ end }}}
					</div>
				</div>
			</div>
		</div>

		<!-- Document Details (compact on mobile, sidebar on desktop) -->
		<div class="doc-details-strip mb-4 d-lg-none">
			<div class="doc-sidebar-card">
				<dl class="doc-details-grid mb-0">
					<div class="doc-detail-item">
						<dt>[[cop-documents:view.file_type]]</dt>
						<dd>.{document.fileExt}</dd>
					</div>
					<div class="doc-detail-item">
						<dt>[[cop-documents:view.file_size]]</dt>
						<dd>{document.fileSize}</dd>
					</div>
					<div class="doc-detail-item">
						<dt>[[cop-documents:view.current_version]]</dt>
						<dd>v{document.currentVersion}</dd>
					</div>
					<div class="doc-detail-item">
						<dt>[[cop-documents:view.category]]</dt>
						<dd>{document.categoryLabel}</dd>
					</div>
					<div class="doc-detail-item">
						<dt>[[cop-documents:view.access]]</dt>
						<dd>{document.accessLabel}</dd>
					</div>
					<div class="doc-detail-item">
						<dt>[[cop-documents:view.language]]</dt>
						<dd>{document.language}</dd>
					</div>
					{{{ if document.region }}}
					<div class="doc-detail-item">
						<dt>[[cop-documents:view.region]]</dt>
						<dd>{document.region}</dd>
					</div>
					{{{ end }}}
					{{{ if document.sector }}}
					<div class="doc-detail-item">
						<dt>[[cop-documents:view.sector]]</dt>
						<dd>{document.sector}</dd>
					</div>
					{{{ end }}}
				</dl>
				{{{ if document.tagsArray.length }}}
				<div class="doc-tags mt-2">
					{{{ each document.tagsArray }}}
					<span class="badge bg-info text-dark">{@value}</span>
					{{{ end }}}
				</div>
				{{{ end }}}
			</div>
		</div>

		<div class="row">
			<!-- Main Content -->
			<div class="col-lg-9">
				<!-- Preview Panel -->
				<div class="doc-preview-panel mb-4">
					<div class="d-flex align-items-center justify-content-between mb-3">
						<h5 class="mb-0">[[cop-documents:view.preview]]</h5>
						{{{ if (previewType == "pdf") }}}
						<button type="button" class="btn btn-sm btn-outline-secondary" id="doc-fullscreen-btn" title="[[cop-documents:view.fullscreen]]">
							<i class="fa fa-expand"></i> <span class="d-none d-sm-inline">[[cop-documents:view.fullscreen]]</span>
						</button>
						{{{ end }}}
					</div>
					{{{ if (previewType == "pdf") }}}
					<div class="doc-preview-frame" id="doc-preview-frame">
						<object data="{document.fileUrl}" type="application/pdf" width="100%" class="doc-pdf-object">
							<iframe src="{document.fileUrl}" width="100%" class="doc-pdf-iframe">
								<p class="text-center p-4">
									[[cop-documents:view.preview_unavailable]]
									<br>
									<a href="{document.fileUrl}" target="_blank" rel="noopener" class="btn btn-primary mt-2 doc-download-btn" data-doc-id="{document.docId}">
										<i class="fa fa-download"></i> [[cop-documents:view.preview_download_cta]]
									</a>
								</p>
							</iframe>
						</object>
					</div>
					{{{ end }}}

					{{{ if (previewType == "image") }}}
					<div class="doc-preview-image-wrap">
						<img src="{document.fileUrl}" alt="{document.title}" class="doc-preview-image" data-action="lightbox">
					</div>
					{{{ end }}}

					{{{ if (previewType == "none") }}}
					<div class="doc-preview-placeholder text-center">
						<i class="fa fa-file-o doc-preview-placeholder-icon"></i>
						<p class="text-muted mt-3">[[cop-documents:view.preview_unavailable]]</p>
						<a href="{document.fileUrl}" target="_blank" rel="noopener" class="btn btn-primary doc-download-btn" data-doc-id="{document.docId}">
							<i class="fa fa-download"></i> [[cop-documents:view.preview_download_cta]]
						</a>
					</div>
					{{{ end }}}
				</div>

				<!-- Description -->
				<div class="doc-description-panel mb-4">
					<h5 class="mb-3">[[cop-documents:view.description]]</h5>
					<p>{document.description}</p>
				</div>

				<!-- AI Summary -->
				{{{ if aiSummary }}}
				<div class="doc-ai-summary-panel mb-4">
					<h5 class="mb-3"><i class="fa fa-robot me-2"></i>[[cop-documents:ai.summary_title]]</h5>
					<p>{aiSummary}</p>
					<small class="text-muted">[[cop-documents:ai.generated_on]] {aiSummaryTs}</small>
					{{{ if canModerate }}}
					<button class="btn btn-sm btn-outline-secondary ms-2 doc-regenerate-summary-btn" data-doc-id="{document.docId}">
						<i class="fa fa-refresh"></i> [[cop-documents:ai.regenerate]]
					</button>
					{{{ end }}}
				</div>
				{{{ end }}}
				{{{ if (!aiSummary && canModerate) }}}
				<div class="doc-ai-summary-panel doc-ai-summary-empty mb-4">
					<button class="btn btn-sm btn-outline-primary doc-generate-summary-btn" data-doc-id="{document.docId}" data-file-size="{document.fileSize}">
						<i class="fa fa-wand-magic-sparkles me-1"></i>[[cop-documents:ai.generate]]
					</button>
					<div class="doc-ai-progress d-none mt-3">
						<div class="doc-ai-progress-steps">
							<div class="doc-ai-step" data-step="extract">
								<div class="doc-ai-step-icon"><i class="fa fa-file-text"></i></div>
								<div class="doc-ai-step-body">
									<div class="doc-ai-step-label">[[cop-documents:ai.step_extract]]</div>
									<div class="doc-ai-step-detail text-muted small">[[cop-documents:ai.step_extract_detail]]</div>
								</div>
							</div>
							<div class="doc-ai-step" data-step="analyze">
								<div class="doc-ai-step-icon"><i class="fa fa-brain"></i></div>
								<div class="doc-ai-step-body">
									<div class="doc-ai-step-label">[[cop-documents:ai.step_analyze]]</div>
									<div class="doc-ai-step-detail text-muted small">[[cop-documents:ai.step_analyze_detail]]</div>
								</div>
							</div>
							<div class="doc-ai-step" data-step="generate">
								<div class="doc-ai-step-icon"><i class="fa fa-wand-magic-sparkles"></i></div>
								<div class="doc-ai-step-body">
									<div class="doc-ai-step-label">[[cop-documents:ai.step_generate]]</div>
									<div class="doc-ai-step-detail text-muted small">[[cop-documents:ai.step_generate_detail]]</div>
								</div>
							</div>
						</div>
						<div class="doc-ai-progress-note text-muted small mt-2">
							<i class="fa fa-clock me-1"></i><span class="doc-ai-time-estimate"></span>
						</div>
					</div>
				</div>
				{{{ end }}}

				<!-- Version History -->
				{{{ if versions.length }}}
				<div class="doc-versions-panel mb-4">
					<h5 class="mb-3">[[cop-documents:view.versions]]</h5>
					<div class="doc-version-timeline">
						{{{each versions}}}
						<div class="doc-version-item">
							<div class="doc-version-dot"></div>
							<div class="doc-version-content">
								<div class="d-flex justify-content-between align-items-start">
									<div>
										<span class="fw-semibold">v{./version}</span>
										{{{ if ./user }}}
										<span class="text-muted ms-2">[[cop-documents:view.uploaded_by]] {./user.username}</span>
										{{{ end }}}
									</div>
									<small class="text-muted">{./createdAt}</small>
								</div>
								{{{ if ./note }}}
								<p class="text-muted mb-0 mt-1 small">{./note}</p>
								{{{ end }}}
							</div>
						</div>
						{{{end}}}
					</div>
				</div>
				{{{ end }}}

				<!-- Upload New Version (if logged in) -->
				{{{ if loggedIn }}}
				<div class="doc-new-version-panel mb-4">
					<h5 class="mb-3">[[cop-documents:view.new_version]]</h5>
					<form id="version-upload-form" data-doc-id="{document.docId}">
						<div class="mb-3">
							<label class="form-label" for="version-file">[[cop-documents:upload.file]]</label>
							<input type="file" class="form-control" id="version-file" name="file" required>
						</div>
						<div class="mb-3">
							<label class="form-label" for="version-note">[[cop-documents:view.new_version_note]]</label>
							<input type="text" class="form-control" id="version-note" name="note" required>
						</div>
						<button type="submit" class="btn btn-primary btn-sm">
							<i class="fa fa-upload"></i> [[cop-documents:upload.submit]]
						</button>
					</form>
				</div>
				{{{ end }}}

				<!-- Moderation Actions -->
				{{{ if canModerate }}}
				<div class="doc-moderation-panel mb-4">
					<h5 class="mb-3">[[cop-documents:moderation.actions]]</h5>
					<div class="d-flex flex-wrap gap-2">
						{{{ if (document.status == "pending") }}}
						<button class="btn btn-success doc-approve-btn" data-doc-id="{document.docId}">
							<i class="fa fa-check"></i> [[cop-documents:moderation.approve]]
						</button>
						<button class="btn btn-warning doc-reject-btn" data-doc-id="{document.docId}">
							<i class="fa fa-times"></i> [[cop-documents:moderation.reject]]
						</button>
						{{{ end }}}
						<button class="btn btn-danger doc-delete-btn" data-doc-id="{document.docId}">
							<i class="fa fa-trash"></i> [[cop-documents:moderation.delete]]
						</button>
					</div>
				</div>
				{{{ end }}}
			</div>

			<!-- Sidebar (desktop only — mobile gets compact strip above) -->
			<div class="col-lg-3 d-none d-lg-block">
				<div class="doc-sidebar-card mb-4">
					<h6 class="doc-sidebar-card-title" data-bs-toggle="collapse" data-bs-target="#doc-details-collapse" aria-expanded="true" role="button">
						[[cop-documents:view.details]]
						<i class="fa fa-chevron-up float-end doc-collapse-icon"></i>
					</h6>
					<div class="collapse show" id="doc-details-collapse">
						<dl class="doc-sidebar-dl mb-0">
							<dt>[[cop-documents:view.author]]</dt>
							<dd>{document.author}</dd>
							<dt>[[cop-documents:view.date]]</dt>
							<dd>{document.date}</dd>
							<dt>[[cop-documents:view.category]]</dt>
							<dd>{document.categoryLabel}</dd>
							<dt>[[cop-documents:view.file_type]]</dt>
							<dd>.{document.fileExt}</dd>
							<dt>[[cop-documents:view.file_size]]</dt>
							<dd>{document.fileSize}</dd>
							<dt>[[cop-documents:view.current_version]]</dt>
							<dd>v{document.currentVersion}</dd>
							<dt>[[cop-documents:view.tags]]</dt>
							<dd class="doc-tags">
								{{{ each document.tagsArray }}}
								<span class="badge bg-info text-dark">{@value}</span>
								{{{ end }}}
							</dd>
							{{{ if document.region }}}
							<dt>[[cop-documents:view.region]]</dt>
							<dd>{document.region}</dd>
							{{{ end }}}
							{{{ if document.sector }}}
							<dt>[[cop-documents:view.sector]]</dt>
							<dd>{document.sector}</dd>
							{{{ end }}}
							{{{ if document.sourceOrg }}}
							<dt>[[cop-documents:view.source_org]]</dt>
							<dd>{document.sourceOrg}</dd>
							{{{ end }}}
							{{{ if document.pubDate }}}
							<dt>[[cop-documents:view.pub_date]]</dt>
							<dd>{document.pubDate}</dd>
							{{{ end }}}
							<dt>[[cop-documents:view.language]]</dt>
							<dd>{document.language}</dd>
							<dt>[[cop-documents:view.access]]</dt>
							<dd>{document.accessLabel}</dd>
							<dt>[[cop-documents:view.status]]</dt>
							<dd>
								{{{ if (document.status == "approved") }}}
								<span class="badge bg-success">[[cop-documents:view.status_approved]]</span>
								{{{ end }}}
								{{{ if (document.status == "pending") }}}
								<span class="badge bg-warning text-dark">[[cop-documents:view.status_pending]]</span>
								{{{ end }}}
								{{{ if (document.status == "rejected") }}}
								<span class="badge bg-danger">[[cop-documents:view.status_rejected]]</span>
								{{{ end }}}
							</dd>
						</dl>
						<div class="mt-3">
							<a href="{document.fileUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm w-100 doc-download-btn" data-doc-id="{document.docId}">
								<i class="fa fa-download"></i> [[cop-documents:view.download]]
							</a>
							<small class="text-muted d-block text-center mt-1">{document.downloads} [[cop-documents:view.download_count]]</small>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Edit Modal -->
	{{{ if canEdit }}}
	<div class="modal fade" id="editDocumentModal" tabindex="-1" aria-labelledby="editDocumentModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="editDocumentModalLabel">[[cop-documents:view.edit_metadata]]</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form id="edit-document-form" data-doc-id="{document.docId}">
						<div class="mb-3">
							<label class="form-label" for="edit-title">[[cop-documents:upload.doc_title]] *</label>
							<input type="text" class="form-control" id="edit-title" name="title" value="{document.title}" required>
						</div>
						<div class="mb-3">
							<label class="form-label" for="edit-author">[[cop-documents:upload.author]] *</label>
							<input type="text" class="form-control" id="edit-author" name="author" value="{document.author}" required>
						</div>
						<div class="mb-3">
							<label class="form-label" for="edit-date">[[cop-documents:upload.date]] *</label>
							<input type="date" class="form-control" id="edit-date" name="date" value="{document.date}" required>
						</div>
						<div class="mb-3">
							<label class="form-label" for="edit-description">[[cop-documents:upload.description]] *</label>
							<textarea class="form-control" id="edit-description" name="description" rows="4" required>{document.description}</textarea>
							<div class="form-text">[[cop-documents:upload.description_help]]</div>
						</div>
						<div class="mb-3">
							<label class="form-label" for="edit-category">[[cop-documents:upload.category]] *</label>
							<select class="form-select" id="edit-category" name="category" required>
								{{{ each categoryOptions }}}
								<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>{./label}</option>
								{{{ end }}}
							</select>
						</div>
						<div class="mb-3">
							<label class="form-label" for="edit-tags">[[cop-documents:upload.tags]] *</label>
							<input type="text" class="form-control" id="edit-tags" name="tags" value="{document.tags}" required>
							<div class="form-text">[[cop-documents:upload.tags_help]]</div>
						</div>
						<div class="row">
							<div class="col-md-6 mb-3">
								<label class="form-label" for="edit-region">[[cop-documents:upload.region]]</label>
								<input type="text" class="form-control" id="edit-region" name="region" value="{document.region}">
							</div>
							<div class="col-md-6 mb-3">
								<label class="form-label" for="edit-sector">[[cop-documents:upload.sector]]</label>
								<input type="text" class="form-control" id="edit-sector" name="sector" value="{document.sector}">
							</div>
						</div>
						<div class="mb-3">
							<label class="form-label" for="edit-sourceOrg">[[cop-documents:upload.source_org]]</label>
							<input type="text" class="form-control" id="edit-sourceOrg" name="sourceOrg" value="{document.sourceOrg}">
						</div>
						<div class="row">
							<div class="col-md-6 mb-3">
								<label class="form-label" for="edit-pubDate">[[cop-documents:upload.pub_date]]</label>
								<input type="date" class="form-control" id="edit-pubDate" name="pubDate" value="{document.pubDate}">
							</div>
							<div class="col-md-6 mb-3">
								<label class="form-label" for="edit-language">[[cop-documents:upload.language]]</label>
								<select class="form-select" id="edit-language" name="language">
									<option value="fr" {{{ if (document.language == "fr") }}}selected{{{ end }}}>[[cop-documents:lang.fr]]</option>
									<option value="en" {{{ if (document.language == "en") }}}selected{{{ end }}}>[[cop-documents:lang.en]]</option>
								</select>
							</div>
						</div>
						<div class="mb-3">
							<label class="form-label" for="edit-access">[[cop-documents:upload.access]] <span class="text-danger">*</span></label>
							<select class="form-select" id="edit-access" name="access" required>
								{{{each accessOptions}}}
								<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>{./label}</option>
								{{{end}}}
							</select>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">[[cop-documents:view.edit_cancel]]</button>
					<button type="button" class="btn btn-primary" id="edit-document-save">
						<i class="fa fa-save"></i> [[cop-documents:view.edit_save]]
					</button>
				</div>
			</div>
		</div>
	</div>
	{{{ end }}}

	<!-- Lightbox Overlay -->
	<div class="doc-lightbox" id="docLightbox">
		<div class="doc-lightbox-backdrop"></div>
		<div class="doc-lightbox-content">
			<img src="" alt="" class="doc-lightbox-img">
			<button class="doc-lightbox-close" aria-label="Close">&times;</button>
		</div>
	</div>
</div>
