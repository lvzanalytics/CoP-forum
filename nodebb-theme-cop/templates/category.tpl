<!-- IMPORT partials/breadcrumbs-json-ld.tpl -->

<div class="cop-category-view d-flex flex-column flex-fill">
	<!-- Category header -->
	<div class="category-header d-flex flex-wrap align-items-center gap-3">
		{buildCategoryIcon(@value, "36px", "rounded-2 flex-shrink-0")}
		<div class="d-flex flex-column">
			<h1 class="mb-0">{./name}</h1>
		</div>
		<div class="d-flex gap-2 ms-auto align-items-center">
			<span class="badge text-body border border-0 stats">
				<span class="fw-bold">{humanReadableNumber(totalTopicCount)}</span>
				<span class="text-lowercase fw-normal">[[global:topics]]</span>
			</span>
			<span class="badge text-body border border-0 stats">
				<span class="fw-bold">{humanReadableNumber(totalPostCount)}</span>
				<span class="text-lowercase fw-normal">[[global:posts]]</span>
			</span>
		</div>
	</div>

	{{{ if ./descriptionParsed }}}
	<div class="py-2 text-muted" style="font-size: 14px;">
		{./descriptionParsed}
	</div>
	{{{ end }}}

	{{{ if widgets.header.length }}}
	<div data-widget-area="header" class="py-2">
		{{{ each widgets.header }}}
		{{widgets.header.html}}
		{{{ end }}}
	</div>
	{{{ end }}}

	<div class="flex-fill d-flex flex-column">
		<!-- IMPORT partials/category/subcategory.tpl -->

		{{{ if (topics.length || privileges.topics:create) }}}
		<!-- IMPORT partials/topic-list-bar.tpl -->
		{{{ end }}}

		{{{ if (./inbox && (./hasFollowers == false)) }}}
		<div class="alert alert-warning mt-3" id="category-no-followers" data-bs-toggle="dropdown" data-bs-target='[component="topic/watch"] button' aria-hidden="true">
			<i class="fa fa-triangle-exclamation pe-2"></i>
			[[category:no-followers]]
			<a href="#" class="stretched-link"></a>
		</div>
		{{{ end }}}

		{{{ if (!topics.length && privileges.topics:create) }}}
		<div class="alert alert-info mt-3" id="category-no-topics">
			[[category:no-topics]]
		</div>
		{{{ end }}}

		<!-- IMPORT partials/topics_list.tpl -->

		{{{ if config.usePagination }}}
		<div class="py-3">
		<!-- IMPORT partials/paginator.tpl -->
		</div>
		{{{ end }}}
	</div>
</div>

<div data-widget-area="footer">
	{{{each widgets.footer}}}
	{{widgets.footer.html}}
	{{{end}}}
</div>

{{{ if !config.usePagination }}}
<noscript>
	<!-- IMPORT partials/paginator.tpl -->
</noscript>
{{{ end }}}
