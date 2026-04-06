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
				<a href="{config.relative_path}/user/{members.userslug}" class="member-card-link">
					<div class="member-card h-100">
						<div class="member-card__header">
							<div class="member-card__avatar">
								{{{ if members.picture }}}
								<img src="{members.picture}" alt="{members.username}" loading="lazy" />
								{{{ else }}}
								<div class="member-card__initials" style="background-color: {members.icon:bgColor};">
									{members.icon:text}
								</div>
								{{{ end }}}
							</div>
							<div class="member-card__identity">
								<h5 class="member-card__name">
									{{{ if members.fullname }}}{members.fullname}{{{ else }}}{members.username}{{{ end }}}
								</h5>
								{{{ if members.title_role }}}
								<span class="member-card__role">{members.title_role}</span>
								{{{ end }}}
							</div>
						</div>

						{{{ if members.fullname_org }}}
						<div class="member-card__detail">
							<i class="fa fa-building-o"></i>
							<span>{members.fullname_org}</span>
						</div>
						{{{ end }}}

						{{{ if members.org_type }}}
						<div class="member-card__detail">
							<i class="fa fa-tag"></i>
							<span class="member-card__org-badge">{members.org_type}</span>
						</div>
						{{{ end }}}

						{{{ if members.region }}}
						<div class="member-card__detail">
							<i class="fa fa-map-marker"></i>
							<span>{members.region}</span>
						</div>
						{{{ end }}}

						{{{ if members.sector }}}
						<div class="member-card__detail">
							<i class="fa fa-industry"></i>
							<span>{members.sector}</span>
						</div>
						{{{ end }}}

						{{{ if members.expertiseList.length }}}
						<div class="member-card__expertise">
							{{{ each members.expertiseList }}}
							<span class="member-card__expertise-tag">{@value}</span>
							{{{ end }}}
						</div>
						{{{ end }}}

						{{{ if members.bio_pro }}}
						<p class="member-card__bio">{members.bio_pro}</p>
						{{{ end }}}

						<div class="member-card__actions">
							<span class="member-card__profile-link">
								[[cop-directory:directory.view_profile]] <i class="fa fa-arrow-right"></i>
							</span>
						</div>
					</div>
				</a>
			</div>
			{{{ end }}}
		</div>

		<!-- Pagination -->
		<!-- IMPORT partials/paginator.tpl -->
	</div>
</div>
