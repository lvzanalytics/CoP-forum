<div class="documents-library" data-widget-area="header">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="fw-semibold tracking-tight mb-4">[[cop-documents:library.title]]</h2>
			</div>
		</div>

		<!-- Filter Bar -->
		<div class="doc-filter-bar card mb-4">
			<div class="card-body">
				<form method="GET" action="{config.relative_path}/documents" class="row g-3 align-items-end">
					<div class="col-md-3">
						<label class="form-label" for="filter-q">[[cop-documents:library.search_placeholder]]</label>
						<input type="text" class="form-control" id="filter-q" name="q" value="{filters.q}" placeholder="[[cop-documents:library.search_placeholder]]">
					</div>
					<div class="col-md-2">
						<label class="form-label" for="filter-category">[[cop-documents:library.filter_category]]</label>
						<select class="form-select" id="filter-category" name="category">
							<option value="">--</option>
							{{{each categoryOptions}}}
							<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>{./label}</option>
							{{{end}}}
						</select>
					</div>
					<div class="col-md-2">
						<label class="form-label" for="filter-region">[[cop-documents:library.filter_region]]</label>
						<select class="form-select" id="filter-region" name="region">
							<option value="">--</option>
							{{{each regionOptions}}}
							<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>{./label}</option>
							{{{end}}}
						</select>
					</div>
					<div class="col-md-2">
						<label class="form-label" for="filter-sector">[[cop-documents:library.filter_sector]]</label>
						<input type="text" class="form-control" id="filter-sector" name="sector" value="{filters.sector}">
					</div>
					<div class="col-md-2">
						<label class="form-label" for="filter-sort">[[cop-documents:library.sort]]</label>
						<select class="form-select" id="filter-sort" name="sort">
							{{{each sortOptions}}}
							<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>{./label}</option>
							{{{end}}}
						</select>
					</div>
					<div class="col-md-1">
						<button type="submit" class="btn btn-primary w-100"><i class="fa fa-search"></i></button>
					</div>
				</form>
			</div>
		</div>

		<!-- Pending Review Banner (moderators only) -->
		{{{ if canModerate }}}
		{{{ if pendingCount }}}
		<div class="alert alert-warning d-flex align-items-center justify-content-between mb-3">
			<span>
				<i class="fa fa-exclamation-triangle me-2"></i>
				[[cop-documents:library.pending_banner, {pendingCount}]]
			</span>
			<a href="{config.relative_path}/documents/pending" class="btn btn-warning btn-sm">
				<i class="fa fa-gavel me-1"></i> [[cop-documents:library.pending_review_btn]]
			</a>
		</div>
		{{{ end }}}
		{{{ end }}}

		<!-- Action Buttons -->
		{{{ if loggedIn }}}
		<div class="mb-3 d-flex flex-wrap gap-2">
			<a href="{config.relative_path}/documents/upload" class="btn btn-success">
				<i class="fa fa-upload me-1"></i> [[cop-documents:library.upload_btn]]
			</a>
			<a href="{config.relative_path}/documents/my" class="btn btn-outline-secondary">
				<i class="fa fa-folder-o me-1"></i> [[cop-documents:my.title]]
			</a>
		</div>
		{{{ end }}}

		<!-- Document Cards -->
		{{{ if !documents.length }}}
		<div class="alert alert-info">[[cop-documents:library.no_results]]</div>
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
							<span class="doc-card-category">{./categoryLabel}</span>
						</div>
						<h5 class="doc-card-title">{./title}</h5>
						<div class="doc-card-meta">
							<span><i class="fa fa-user-o"></i> {./author}</span>
							<span><i class="fa fa-calendar-o"></i> {./date}</span>
						</div>
						<p class="doc-card-desc">{./description}</p>
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

		<!-- Pagination -->
		<!-- IMPORT partials/paginator.tpl -->
	</div>
</div>
