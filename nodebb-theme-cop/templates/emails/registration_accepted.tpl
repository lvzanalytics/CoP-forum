<!-- IMPORT emails/partials/header.tpl -->

<!-- Email Body : BEGIN -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">

	<!-- 1 Column Text + Button : BEGIN -->
	<tr>
		<td bgcolor="#ffffff">
			<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
				<tr>
					<td style="padding: 40px 40px 6px 40px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
						<h1 style="margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 27px; color: #1B1B1B; font-weight: normal;">[[email:welcome.text1, {site_title}]]</h1>
					</td>
				</tr>
				<tr>
					<td style="padding: 0px 40px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
						<h1 style="margin: 0 0 10px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 18px; line-height: 21px; color: #aaaaaa; font-weight: normal;">[[email:welcome.text3]]</h1>
					</td>
				</tr>
				<tr>
					<td style="padding: 32px 40px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
						<!-- Button : BEGIN -->
						<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto;">
							<tr>
								<td style="border-radius: 6px; background: #2D6A4F; text-align: center;" class="button-td">
									<a href="{url}" style="background: #2D6A4F; border: 15px solid #2D6A4F; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 6px; font-weight: bold;" class="button-a">
										<span style="color:#ffffff;" class="button-link">[[email:digest.cta, {site_title}]] &rarr;</span>
									</a>
								</td>
							</tr>
						</table>
						<!-- Button : END -->
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<!-- 1 Column Text + Button : END -->

</table>
<!-- Email Body : END -->

<!-- IMPORT emails/partials/footer.tpl -->
