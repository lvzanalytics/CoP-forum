
			</div><!-- /#content -->

			<!-- Site Footer -->
			<footer class="cop-site-footer">
				<div class="cop-footer__brand">
					{{{ if brand:logo }}}
					<img src="{brand:logo}?{config.cache-buster}" alt="{config.siteTitle}" />
					{{{ end }}}
					<span>{config.siteTitle}</span>
				</div>
				<p class="cop-footer__tagline">[[themes/cop:footer.tagline]]</p>
				<div class="cop-footer__links">
					<a href="{relative_path}/">[[themes/cop:nav.home]]</a>
					<a href="{relative_path}/recent">[[themes/cop:nav.recent]]</a>
					<a href="{relative_path}/users">[[themes/cop:nav.members]]</a>
				</div>
				<p class="cop-footer__copyright">[[themes/cop:footer.copyright]]</p>
			</footer>
		</div><!-- /.cop-page-wrapper -->
	</main>

	{{{ if !isSpider }}}
	<div>
		<div component="toaster/tray" class="alert-window fixed-bottom mb-5 mb-md-2 me-2 me-md-5 ms-auto" style="width:300px; z-index: 1090;">
			<!-- IMPORT partials/reconnect-alert.tpl -->
		</div>
	</div>
	{{{ end }}}

	<!-- IMPORT partials/footer/js.tpl -->
</body>
</html>
