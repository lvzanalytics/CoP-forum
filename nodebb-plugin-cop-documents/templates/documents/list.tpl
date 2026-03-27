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
						<input type="text" class="form-control" id="filter-region" name="region" value="{filters.region}">
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

		<!-- Upload Button -->
		{{{ if loggedIn }}}
		<div class="mb-3">
			<a href="{config.relative_path}/documents/upload" class="btn btn-success">
				<i class="fa fa-upload"></i> [[cop-documents:library.upload_btn]]
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
				<div class="card doc-card h-100">
					<div class="card-body">
						<div class="d-flex justify-content-between align-items-start mb-2">
							<h5 class="card-title mb-0">
								<a href="{config.relative_path}/documents/{./docId}/{./slug}">{./title}</a>
							</h5>
							<span class="badge bg-secondary ms-2">{./categoryLabel}</span>
						</div>
						<p class="text-muted small mb-2">
							<i class="fa fa-user"></i> {./author}
							&middot;
							<i class="fa fa-calendar"></i> {./date}
						</p>
						<p class="card-text">{./description}</p>
						<div class="doc-tags mb-2">
							{{{ each ./tagsArray }}}
							<span class="badge bg-info text-dark">{@value}</span>
							{{{ end }}}
						</div>
						<div class="text-muted small">
							<i class="fa fa-download"></i> {./downloads} [[cop-documents:library.downloads]]
						</div>
					</div>
				</div>
			</div>
			{{{end}}}
		</div>

		<!-- Pagination -->
		<!-- IMPORT partials/paginator.tpl -->
	</div>
</div>
