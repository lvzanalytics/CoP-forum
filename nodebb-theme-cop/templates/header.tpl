<!DOCTYPE html>
<html lang="{function.localeToHTML, userLang, defaultLang}" {{{if languageDirection}}}data-dir="{languageDirection}" style="direction: {languageDirection};"{{{end}}}>
<head>
	<title>{browserTitle}</title>
	{{{each metaTags}}}{function.buildMetaTag}{{{end}}}
	<link rel="stylesheet" type="text/css" href="{relative_path}/assets/client{{{if bootswatchSkin}}}-{bootswatchSkin}{{{end}}}{{{ if (languageDirection=="rtl") }}}-rtl{{{ end }}}.css?{config.cache-buster}" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
	{{{each linkTags}}}{function.buildLinkTag}{{{end}}}

	<script>
		var config = JSON.parse('{{configJSON}}');
		var app = {
			user: JSON.parse('{{userJSON}}')
		};
		document.documentElement.style.setProperty('--panel-offset', `0px`);
	</script>

	{{{if useCustomHTML}}}
	{{customHTML}}
	{{{end}}}
	{{{if useCustomCSS}}}
	<style>{{customCSS}}</style>
	{{{end}}}
</head>

<body class="{bodyClass} cop-theme skin-{{{if bootswatchSkin}}}{bootswatchSkin}{{{else}}}noskin{{{end}}}">
	<a class="visually-hidden-focusable position-absolute top-0 start-0 p-3 m-3 bg-body" style="z-index: 1021;" href="#content">[[global:skip-to-content]]</a>

	<!-- IMPORT partials/header/topbar.tpl -->

	<!-- Mobile drawer -->
	<div class="cop-drawer-overlay" id="cop-drawer-overlay"></div>
	<div class="cop-mobile-drawer" id="cop-mobile-drawer">
		<ul class="cop-drawer-nav">
			<li><a href="{relative_path}/">[[themes/cop:nav.home]]</a></li>
			<li><a href="{relative_path}/documents">[[themes/cop:nav.documents]]</a></li>
			<li><a href="{relative_path}/directory">[[themes/cop:nav.directory]]</a></li>
			<li><a href="{relative_path}/recent">[[themes/cop:nav.recent]]</a></li>
		</ul>
		{{{ if navigation.length }}}
		<h6 class="cop-drawer-section-title">[[themes/cop:nav.more]]</h6>
		<ul class="cop-drawer-nav">
			{{{ each navigation }}}
			{{{ if displayMenuItem(@root, @index) }}}
			<li>
				<a href="{./route}" {{{ if ./id }}}id="{./id}"{{{ end }}}{{{ if ./targetBlank }}} target="_blank"{{{ end }}}>
					{{{ if ./iconClass }}}<i class="fa {./iconClass} me-2"></i>{{{ end }}}
					{./text}
				</a>
			</li>
			{{{ end }}}
			{{{ end }}}
		</ul>
		{{{ end }}}
		<h6 class="cop-drawer-section-title">[[themes/cop:nav.espaces]]</h6>
		<ul class="cop-drawer-categories">
			{{{ each allCategories }}}
			<li>
				<a href="{config.relative_path}/category/{allCategories.slug}">
					<span class="cop-drawer-cat-icon">
						{{{ if allCategories.icon }}}<i class="fa {allCategories.icon}"></i>{{{ else }}}#{{{ end }}}
					</span>
					<span>{allCategories.name}</span>
				</a>
			</li>
			{{{ end }}}
		</ul>
	</div>

	<main id="panel">
		<div class="cop-page-wrapper">
			<div id="content">
			<!-- IMPORT partials/noscript/warning.tpl -->
			<!-- IMPORT partials/noscript/message.tpl -->
