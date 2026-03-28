<div class="directory-page" component="directory">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="fw-semibold tracking-tight mb-3">[[cop-directory:directory.title]]</h2>
			</div>
		</div>

		<!-- Search and filters -->
		<div class="directory-filters card mb-4">
			<div class="card-body">
				<form id="directory-search-form" method="get" action="{config.relative_path}/directory">
					<div class="row g-2 mb-2">
						<div class="col-12">
							<div class="input-group">
								<input type="text" class="form-control" name="q" value="{filters.q}" placeholder="[[cop-directory:directory.search_placeholder]]" />
								<button class="btn btn-primary" type="submit">
									<i class="fa fa-search"></i>
								</button>
							</div>
						</div>
					</div>
					<div class="row g-2">
						<div class="col-6 col-lg-3">
							<select class="form-select" name="expertise" id="filter-expertise">
								<option value="">[[cop-directory:directory.filter_expertise]]</option>
								{{{ each expertiseOptions }}}
								<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>
									{./value}
								</option>
								{{{ end }}}
							</select>
						</div>

						<div class="col-6 col-lg-3">
							<select class="form-select" name="region" id="filter-region">
								<option value="">[[cop-directory:directory.filter_region]]</option>
								{{{ each regionOptions }}}
								<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>
									{./value}
								</option>
								{{{ end }}}
							</select>
						</div>

						<div class="col-6 col-lg-3">
							<select class="form-select" name="sector" id="filter-sector">
								<option value="">[[cop-directory:directory.filter_sector]]</option>
								{{{ each sectorOptions }}}
								<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>
									{./value}
								</option>
								{{{ end }}}
							</select>
						</div>

						<div class="col-6 col-lg-3">
							<select class="form-select" name="org_type" id="filter-org-type">
								<option value="">[[cop-directory:directory.filter_org_type]]</option>
								{{{ each orgTypeOptions }}}
								<option value="{./value}" {{{ if ./selected }}}selected{{{ end }}}>
									{./value}
								</option>
								{{{ end }}}
							</select>
						</div>
					</div>
					<div class="row g-2 mt-1">
						<div class="col-6 col-lg-3">
							<select class="form-select" name="sort" id="filter-sort">
								<option value="">[[cop-directory:directory.sort]]</option>
								<option value="name" {{{ if (filters.sort == "name") }}}selected{{{ end }}}>[[cop-directory:directory.sort_name]]</option>
								<option value="newest" {{{ if (filters.sort == "newest") }}}selected{{{ end }}}>[[cop-directory:directory.sort_newest]]</option>
							</select>
							<input type="hidden" name="page" value="1" />
						</div>
					</div>
				</form>
			</div>
		</div>

		<!-- Opt-out toggle -->
		{{{ if loggedIn }}}
		{{{ if enableOptOut }}}
		<div class="mb-3">
			<div class="form-check form-switch">
				<input class="form-check-input" type="checkbox" id="directory-opt-out" {{{ if optedOut }}}checked{{{ end }}} />
				<label class="form-check-label" for="directory-opt-out">
					[[cop-directory:directory.opt_out]]
				</label>
			</div>
			<small class="text-muted" id="opt-out-status">
				{{{ if optedOut }}}
				[[cop-directory:directory.opted_out]]
				{{{ else }}}
				[[cop-directory:directory.opted_in]]
				{{{ end }}}
			</small>
		</div>
		{{{ end }}}
		{{{ end }}}

		<!-- Results count -->
		<div class="mb-3">
			<p class="text-muted">[[cop-directory:directory.results_count, {total}]]</p>
		</div>

		<!-- Member cards -->
		{{{ if !members.length }}}
		<div class="alert alert-info">
			[[cop-directory:directory.no_results]]
		</div>
		{{{ end }}}

		<div class="row g-3" id="directory-results">
			{{{ each members }}}
			<div class="col-12 col-sm-6 col-lg-4">
				<div class="card member-card h-100">
					<div class="card-body d-flex flex-column">
						<div class="d-flex align-items-center mb-3">
							<div class="member-card__avatar me-3">
								{{{ if members.picture }}}
								<img src="{members.picture}" alt="{members.username}" class="rounded-circle" width="64" height="64" loading="lazy" />
								{{{ else }}}
								<div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; background-color: {members.icon:bgColor}; color: #fff; font-size: 1.5rem; font-weight: 600;">
									{members.icon:text}
								</div>
								{{{ end }}}
							</div>
							<div>
								<h5 class="card-title mb-1">
									{{{ if members.fullname }}}{members.fullname}{{{ else }}}{members.username}{{{ end }}}
								</h5>
								{{{ if members.fullname_org }}}
								<p class="text-muted mb-0 small">{members.fullname_org}</p>
								{{{ end }}}
							</div>
						</div>

						{{{ if members.title_role }}}
						<p class="mb-2 small"><i class="fa fa-briefcase me-1 text-muted"></i> {members.title_role}</p>
						{{{ end }}}

						{{{ if members.org_type }}}
						<p class="mb-2 small">
							<span class="badge bg-secondary">{members.org_type}</span>
						</p>
						{{{ end }}}

						{{{ if members.region }}}
						<p class="mb-2 small"><i class="fa fa-map-marker me-1 text-muted"></i> {members.region}</p>
						{{{ end }}}

						{{{ if members.sector }}}
						<p class="mb-2 small"><i class="fa fa-industry me-1 text-muted"></i> {members.sector}</p>
						{{{ end }}}

						{{{ if members.expertiseList.length }}}
						<div class="member-card__expertise mb-2">
							{{{ each members.expertiseList }}}
							<span class="badge bg-primary-subtle text-primary me-1 mb-1">{@value}</span>
							{{{ end }}}
						</div>
						{{{ end }}}

						{{{ if members.bio_pro }}}
						<p class="small text-muted mb-2 flex-grow-1">{members.bio_pro}</p>
						{{{ end }}}

						<div class="mt-auto pt-2 d-flex gap-2">
							<a href="{config.relative_path}/user/{members.userslug}" class="btn btn-sm btn-outline-primary">
								[[cop-directory:directory.view_profile]]
							</a>
							{{{ if ../loggedIn }}}
							<a href="{config.relative_path}/user/{members.userslug}/chats" class="btn btn-sm btn-outline-secondary">
								<i class="fa fa-envelope me-1"></i>[[cop-directory:directory.send_message]]
							</a>
							{{{ end }}}
						</div>
					</div>
				</div>
			</div>
			{{{ end }}}
		</div>

		<!-- Pagination -->
		<!-- IMPORT partials/paginator.tpl -->
	</div>
</div>
