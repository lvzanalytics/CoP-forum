<div data-widget-area="header">
	{{{ each widgets.header }}}
	{{widgets.header.html}}
	{{{ end }}}
</div>

<div class="cop-channels-page flex-fill">
	<!-- Hero section -->
	<div class="cop-hero">
		<h1 class="cop-hero__title">{config.siteTitle}</h1>
		<p class="cop-hero__tagline">[[themes/cop:hero.tagline]]</p>
	</div>

	{{{ if showCatchupBanner }}}
	<div class="cop-catchup-banner alert d-flex align-items-center justify-content-between mt-3">
		<span><i class="fa fa-clock-rotate-left me-2"></i>[[themes/cop:ai.catchup_text]]</span>
		<button class="btn btn-sm btn-primary ms-3" component="copai/catchup-btn">
			[[themes/cop:ai.catchup_button]]
		</button>
	</div>
	{{{ end }}}

	{{{ if pagination.pages.length }}}
	<div class="pt-3"><!-- IMPORT partials/category/selector-dropdown-left.tpl --></div>
	{{{ end }}}

	<ul class="categories-list list-unstyled" itemscope itemtype="http://www.schema.org/ItemList">
		{{{ each categories }}}
		<!-- IMPORT partials/categories/item.tpl -->
		{{{ end }}}
	</ul>

	<!-- IMPORT partials/paginator.tpl -->
</div>

<div data-widget-area="footer">
	{{{ each widgets.footer }}}
	{{widgets.footer.html}}
	{{{ end }}}
</div>
