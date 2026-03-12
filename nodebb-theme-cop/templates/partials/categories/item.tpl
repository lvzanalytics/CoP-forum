<li component="categories/category" data-cid="{./cid}" class="cop-category-card d-flex align-items-center gap-3 px-3 py-3 rounded-2 mx-2 my-1 category-{./cid} {./unread-class}">
	<meta itemprop="name" content="{./name}">

	<div class="flex-shrink-0">
		{buildCategoryIcon(@value, "44px", "rounded-2")}
	</div>

	<div class="flex-grow-1 d-flex flex-column gap-1" style="min-width: 0;">
		<div class="d-flex align-items-center gap-2">
			<h2 class="title fs-6 fw-semibold m-0 text-truncate">
				<!-- IMPORT partials/categories/link.tpl -->
			</h2>
			{{{ if !./link }}}
			<div class="d-flex gap-2 ms-auto flex-shrink-0">
				<span class="badge text-body border border-0 stats text-xs" >
					<i class="fa fa-fw fa-list fa-sm"></i>
					<span class="fw-normal">{humanReadableNumber(./totalTopicCount, 0)}</span>
				</span>
				<span class="badge text-body border border-0 stats text-xs" >
					<i class="fa-regular fa-fw fa-message fa-sm"></i>
					<span class="fw-normal">{humanReadableNumber(./totalPostCount, 0)}</span>
				</span>
			</div>
			{{{ end }}}
		</div>
		{{{ if ./descriptionParsed }}}
		<div class="description text-muted text-xs w-100 text-truncate">
			{./descriptionParsed}
		</div>
		{{{ end }}}
		{{{ if !config.hideSubCategories }}}
		{{{ if ./children.length }}}
		<div class="d-flex gap-1 flex-wrap mt-1">
			{{{ each ./children }}}
			{{{ if !./isSection }}}
			<a href="{config.relative_path}/category/{./slug}" class="cop-subcategory-badge badge border border-0 text-decoration-none fw-normal">
				{{{ if ./icon }}}<i class="fa {./icon} fa-sm"></i>{{{ end }}}
				{./name}
			</a>
			{{{ end }}}
			{{{ end }}}
		</div>
		{{{ end }}}
		{{{ end }}}
	</div>

	{{{ if (!./link && ./teaser.pid) }}}
	<div class="d-none d-lg-flex align-items-center gap-2 flex-shrink-0 text-muted" style="max-width: 200px;">
		<a href="{{{ if ./teaser.user.userslug }}}{config.relative_path}/user/{./teaser.user.userslug}{{{ else }}}#{{{ end }}}" class="text-decoration-none avatar-tooltip" title="{./teaser.user.displayname}">{buildAvatar(./teaser.user, "20px", true)}</a>
		<span class="text-xs timeago text-truncate" title="{./teaser.timestampISO}"></span>
	</div>
	{{{ end }}}
</li>
