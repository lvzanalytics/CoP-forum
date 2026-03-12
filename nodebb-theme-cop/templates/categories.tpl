<div data-widget-area="header">
	{{{ each widgets.header }}}
	{{widgets.header.html}}
	{{{ end }}}
</div>

<div class="cop-channels-page flex-fill">
	{{{ if pagination.pages.length }}}
	<div class="px-3 pt-2"><!-- IMPORT partials/category/selector-dropdown-left.tpl --></div>
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
