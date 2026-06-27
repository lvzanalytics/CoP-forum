<div class="documents-library" data-widget-area="header">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<nav aria-label="breadcrumb" class="mb-3">
					<ol class="breadcrumb">
						<li class="breadcrumb-item"><a href="{config.relative_path}/documents">[[cop-documents:library.title]]</a></li>
						<li class="breadcrumb-item active" aria-current="page">[[cop-documents:my.title]]</li>
					</ol>
				</nav>
				<h2 class="fw-semibold tracking-tight mb-4">[[cop-documents:my.title]]</h2>
			</div>
		</div>

		<!-- Status Filter Tabs -->
		<ul class="nav nav-pills mb-4 gap-2">
			<li class="nav-item">
				<a class="nav-link {{{ if !activeFilter }}}active{{{ end }}}" href="{config.relative_path}/documents/my">
					[[cop-documents:my.filter_all]] <span class="badge bg-secondary ms-1">{counts.all}</span>
				</a>
			</li>
			<li class="nav-item">
				<a class="nav-link {{{ if (activeFilter == "pending") }}}active{{{ end }}}" href="{config.relative_path}/documents/my?status=pending">
					[[cop-documents:my.filter_pending]] <span class="badge bg-warning text-dark ms-1">{counts.pending}</span>
				</a>
			</li>
			<li class="nav-item">
				<a class="nav-link {{{ if (activeFilter == "approved") }}}active{{{ end }}}" href="{config.relative_path}/documents/my?status=approved">
					[[cop-documents:my.filter_approved]] <span class="badge bg-success ms-1">{counts.approved}</span>
				</a>
			</li>
			<li class="nav-item">
				<a class="nav-link {{{ if (activeFilter == "rejected") }}}active{{{ end }}}" href="{config.relative_path}/documents/my?status=rejected">
					[[cop-documents:my.filter_rejected]] <span class="badge bg-danger ms-1">{counts.rejected}</span>
				</a>
			</li>
		</ul>

		<!-- Upload Button -->
		<div class="mb-3">
			<a href="{config.relative_path}/documents/upload" class="btn btn-success">
				<i class="fa fa-upload me-1"></i> [[cop-documents:library.upload_btn]]
			</a>
		</div>

		<!-- Document Cards -->
		{{{ if !documents.length }}}
		<div class="alert alert-info">[[cop-documents:my.no_documents]]</div>
		{{{ end }}}

		<div class="row g-3">
			{{{each documents}}}
			<div class="col-md-6 col-lg-4">
				<a href="{config.relative_path}/documents/{./docId}/{./slug}" class="doc-card-link">
					<div class="doc-card h-100">
						<div class="doc-card-header">
							<div class="doc-card-icon">
								<i class="fa fa-file-text-o"></i>
							</div>
							<div class="d-flex align-items-center gap-2">
								<span class="doc-card-category">{./categoryLabel}</span>
								{{{ if (./status == "pending") }}}
								<span class="badge bg-warning text-dark">[[cop-documents:view.status_pending]]</span>
								{{{ end }}}
								{{{ if (./status == "approved") }}}
								<span class="badge bg-success">[[cop-documents:view.status_approved]]</span>
								{{{ end }}}
								{{{ if (./status == "rejected") }}}
								<span class="badge bg-danger">[[cop-documents:view.status_rejected]]</span>
								{{{ end }}}
							</div>
						</div>
						<h5 class="doc-card-title">{./title}</h5>
						<div class="doc-card-meta">
							<span><i class="fa fa-user-o"></i> {./author}</span>
							<span><i class="fa fa-calendar-o"></i> {./date}</span>
						</div>
						<p class="doc-card-desc">{./description}</p>
						{{{ if (./status == "rejected") }}}
						{{{ if ./rejectReason }}}
						<div class="alert alert-danger py-2 px-3 mb-2" role="alert">
							<strong>[[cop-documents:moderation.reject_reason_label]]</strong> {./rejectReason}
						</div>
						{{{ end }}}
						{{{ end }}}
						{{{ if ./aiSummary }}}
						<div class="doc-card-ai-snippet">
							<span class="doc-card-ai-badge"><i class="fa fa-robot"></i> IA</span>
							<span>{./aiSummary}</span>
						</div>
						{{{ end }}}
						{{{ if ./tagsArray.length }}}
						<div class="doc-card-tags">
							{{{ each ./tagsArray }}}
							<span class="doc-card-tag">{@value}</span>
							{{{ end }}}
						</div>
						{{{ end }}}
						<div class="doc-card-footer">
							<span class="doc-card-downloads">
								<i class="fa fa-download"></i> {./downloads} [[cop-documents:library.downloads]]
							</span>
						</div>
					</div>
				</a>
			</div>
			{{{end}}}
		</div>
	</div>
</div>
