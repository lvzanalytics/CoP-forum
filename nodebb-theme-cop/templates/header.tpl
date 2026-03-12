<!DOCTYPE html>
<html lang="{function.localeToHTML, userLang, defaultLang}" {{{if languageDirection}}}data-dir="{languageDirection}" style="direction: {languageDirection};"{{{end}}}>
<head>
	<title>{browserTitle}</title>
	{{{each metaTags}}}{function.buildMetaTag}{{{end}}}
	<link rel="stylesheet" type="text/css" href="{relative_path}/assets/client{{{if bootswatchSkin}}}-{bootswatchSkin}{{{end}}}{{{ if (languageDirection=="rtl") }}}-rtl{{{ end }}}.css?{config.cache-buster}" />
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

	<div class="layout-container d-flex">
		<!-- IMPORT partials/sidebar-left.tpl -->

		<div class="cop-sidebar-overlay" id="cop-sidebar-overlay"></div>

		<main id="panel" class="d-flex flex-column flex-grow-1" style="min-width: 0;">
			<!-- IMPORT partials/header/topbar.tpl -->

			<!-- Brand bar: logo + site title (outside #content so it persists across navigation) -->
			<div class="cop-brand-bar">
				<a href="{relative_path}/" class="cop-brand-link">
					{{{ if brand:logo }}}
					<img src="{brand:logo}?{config.cache-buster}" alt="{config.siteTitle}" class="cop-brand-logo" />
					{{{ end }}}
					{{{ if !brand:logo }}}
					<img src="{relative_path}/plugins/nodebb-theme-cop/cop/logo.JPG" alt="{config.siteTitle}" class="cop-brand-logo" />
					{{{ end }}}
				</a>
				<span class="cop-brand-title">{config.siteTitle}</span>
			</div>

			<div class="d-flex flex-column flex-grow-1 h-100" id="content" style="overflow-y: auto;">
			<!-- IMPORT partials/noscript/warning.tpl -->
			<!-- IMPORT partials/noscript/message.tpl -->
