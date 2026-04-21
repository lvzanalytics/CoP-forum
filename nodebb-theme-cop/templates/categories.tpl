<div class="cop-channels-page flex-fill">
	<!-- Compact Page Header -->
	<div class="cop-channels-header">
		<h1 class="cop-channels-title">[[themes/cop:channels.title]]</h1>
		<p class="cop-channels-subtitle">[[themes/cop:channels.subtitle]]</p>
	</div>

	<!-- Two-column layout -->
	<div class="row g-4">
		<!-- Channels list (left) -->
		<div class="col-lg-8">
			<ul class="cop-channels-list list-unstyled" itemscope itemtype="http://www.schema.org/ItemList">
				{{{ each categories }}}
				<!-- IMPORT partials/categories/item.tpl -->
				{{{ end }}}
			</ul>

			<!-- IMPORT partials/paginator.tpl -->
		</div>

		<!-- Sidebar widgets (right) -->
		<div class="col-lg-4">
			<div class="cop-sidebar-widgets">
				<!-- Digest Widget (logged-in only) -->
				{{{ if isLoggedIn }}}
				{{{ if showDigestWidget }}}
				<div class="cop-widget" component="copai/digest-widget">
					<div class="cop-widget-header">
						<i class="fa fa-bolt"></i>
						<span>[[themes/cop:widget.digest_title]]</span>
					</div>
					<div class="cop-widget-body">
						{{{ if digestContent }}}
						<div class="cop-digest-content" component="copai/digest-content">{digestContent}</div>
						{{{ else }}}
						<div class="cop-widget-empty" component="copai/digest-empty">
							<i class="fa fa-sparkles"></i>
							<p>[[themes/cop:widget.digest_empty]]</p>
						</div>
						{{{ end }}}
						{{{ if isAdmin }}}
						<button class="btn btn-sm btn-primary mt-2 w-100" component="copai/catchup-btn">
							<i class="fa fa-sparkles me-1"></i>[[themes/cop:widget.digest_generate]]
						</button>
						{{{ end }}}
					</div>
				</div>
				{{{ end }}}
				{{{ end }}}

				<!-- Upcoming Events Widget -->
				<div class="cop-widget">
					<div class="cop-widget-header">
						<i class="fa fa-calendar"></i>
						<span>[[themes/cop:widget.events_title]]</span>
					</div>
					<div class="cop-widget-body">
						{{{ if upcomingEvents.length }}}
						{{{ each upcomingEvents }}}
						<a href="{config.relative_path}/events/{./slug}" class="cop-event-item">
							<div class="cop-event-date-badge">
								<span class="cop-event-day">{./dayOfMonth}</span>
								<span class="cop-event-month">{./monthShort}</span>
							</div>
							<div class="cop-event-info">
								<div class="cop-event-title">{./title}</div>
								<div class="cop-event-time text-muted small">{./timeString}</div>
							</div>
						</a>
						{{{ end }}}
						<a href="{config.relative_path}/events" class="cop-widget-link">
							[[themes/cop:widget.events_all]] <i class="fa fa-arrow-right fa-sm"></i>
						</a>
						{{{ else }}}
						<div class="cop-widget-empty">
							<i class="fa fa-calendar-xmark"></i>
							<p>[[themes/cop:widget.events_empty]]</p>
						</div>
						{{{ end }}}
					</div>
				</div>

				<!-- Recent Documents Widget -->
				<div class="cop-widget">
					<div class="cop-widget-header">
						<i class="fa fa-file-lines"></i>
						<span>[[themes/cop:widget.docs_title]]</span>
					</div>
					<div class="cop-widget-body">
						{{{ if recentDocuments.length }}}
						{{{ each recentDocuments }}}
						<a href="{config.relative_path}/documents/{./docId}" class="cop-doc-item">
							<div class="cop-doc-icon">
								<i class="fa fa-file-{./fileTypeIcon}"></i>
							</div>
							<div class="cop-doc-info">
								<div class="cop-doc-title">{./title}</div>
								<div class="cop-doc-author text-muted small">{./authorName}</div>
							</div>
						</a>
						{{{ end }}}
						<a href="{config.relative_path}/documents" class="cop-widget-link">
							[[themes/cop:widget.docs_all]] <i class="fa fa-arrow-right fa-sm"></i>
						</a>
						{{{ else }}}
						<div class="cop-widget-empty">
							<i class="fa fa-folder-open"></i>
							<p>[[themes/cop:widget.docs_empty]]</p>
						</div>
						{{{ end }}}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
