<li component="categories/category" data-cid="{./cid}" class="cop-category-card d-flex align-items-start gap-4 category-{./cid} {./unread-class}">
	<meta itemprop="name" content="{./name}">

	<div class="flex-shrink-0">
		{buildCategoryIcon(@value, "56px", "rounded-3")}
	</div>

	<div class="flex-grow-1 d-flex flex-column gap-1" style="min-width: 0;">
		<div class="d-flex align-items-center gap-2">
			<h2 class="title m-0 text-truncate">
				<!-- IMPORT partials/categories/link.tpl -->
			</h2>
		</div>
		{{{ if ./descriptionParsed }}}
		<div class="description w-100 text-truncate">
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

	{{{ if !./link }}}
	<div class="d-none d-md-flex flex-column align-items-end flex-shrink-0 gap-1">
		<span class="stats">{humanReadableNumber(./totalTopicCount, 0)} [[global:topics]] &middot; {humanReadableNumber(./totalPostCount, 0)} [[global:posts]]</span>
		{{{ if ./teaser.pid }}}
		<div class="d-flex align-items-center gap-2">
			<span class="timeago text-truncate" style="font-size: 13px; color: #AEAEB2;" title="{./teaser.timestampISO}"></span>
		</div>
		{{{ end }}}
	</div>
	{{{ end }}}
</li>
