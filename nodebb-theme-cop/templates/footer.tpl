
			</div><!-- /#content -->

			<!-- Site Footer -->
			<footer class="cop-site-footer">
				<div class="cop-footer__links">
					<a href="{relative_path}/">[[themes/cop:nav.home]]</a>
					<a href="{relative_path}/recent">[[themes/cop:nav.recent]]</a>
					<a href="{relative_path}/users">[[themes/cop:nav.members]]</a>
				</div>
				<p class="cop-footer__copyright">[[themes/cop:footer.copyright]]</p>
				<p class="cop-footer__built-by">[[themes/cop:footer.built-by]] <a href="https://lvzanalytics.com" target="_blank" rel="noopener">LVZ Analytics Corp</a></p>
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
