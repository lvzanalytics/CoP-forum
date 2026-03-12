<nav component="sidebar/left" class="open text-dark sidebar sidebar-left d-flex flex-column justify-content-between">
	<div id="main-nav" class="list-unstyled d-flex flex-column w-100 overflow-y-auto flex-grow-1 mt-2">
		<!-- Channel List -->
		<div class="cop-channel-section">
			<div class="section-header">
				<span class="section-label visible-open">Canaux</span>
			</div>
			<ul class="cop-channel-list">
				{{{ each allCategories }}}
				<li class="cop-channel-item">
					<a href="{config.relative_path}/category/{allCategories.slug}" title="{allCategories.name}">
						{{{ if allCategories.icon }}}
						<span class="channel-icon"><i class="fa {allCategories.icon}"></i></span>
						{{{ else }}}
						<span class="channel-hash">#</span>
						{{{ end }}}
						<span class="channel-name visible-open">{allCategories.name}</span>
					</a>
				</li>
				{{{ end }}}
			</ul>
		</div>

		<!-- Navigation Links -->
		<div class="cop-channel-section">
			<div class="section-header">
				<span class="section-label visible-open">Navigation</span>
			</div>
			<ul class="cop-channel-list">
				{{{ each navigation }}}
				{{{ if displayMenuItem(@root, @index) }}}
				<li class="cop-channel-item nav-item {./class}">
					<a class="d-flex align-items-center gap-2" href="{./route}" {{{ if ./id }}}id="{./id}"{{{ end }}}{{{ if ./targetBlank }}} target="_blank"{{{ end }}} title="{./title}">
						{{{ if ./iconClass }}}
						<span class="channel-icon position-relative">
							<i class="fa {./iconClass}"></i>
							<span component="navigation/count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger {{{ if !./content }}}hidden{{{ end }}}" style="font-size: 0.55rem; padding: 2px 4px;">{./content}</span>
						</span>
						{{{ end }}}
						{{{ if ./text }}}<span class="channel-name visible-open">{./text}</span>{{{ end }}}
					</a>
				</li>
				{{{ end }}}
				{{{ end }}}
			</ul>
		</div>
	</div>

	<!-- Bottom Section -->
	<div class="sidebar-toggle-container">
		{{{ if config.loggedIn }}}
		<div class="d-flex align-items-center gap-2 p-2 mx-1">
			<a href="{relative_path}/user/{user.userslug}" class="d-flex align-items-center gap-2 text-decoration-none flex-grow-1 rounded p-1" style="min-width: 0;">
				{buildAvatar(user, "32px", true)}
				<div class="visible-open flex-column" style="min-width: 0;">
					<span class="fw-semibold small text-truncate" style="color: var(--bs-body-color);">{user.displayname}</span>
					<span class="text-muted" style="font-size: 0.7rem;">En ligne</span>
				</div>
			</a>
		</div>
		{{{ end }}}

		<div class="sidebar-toggle m-2 d-none d-lg-block">
			<a href="#" role="button" component="sidebar/toggle" class="nav-link d-flex gap-2 align-items-center p-2 pointer w-100 text-nowrap" title="[[themes/harmony:expand]]" aria-label="[[themes/harmony:sidebar-toggle]]">
				<i class="fa fa-fw fa-angles-right"></i>
				<i class="fa fa-fw fa-angles-left"></i>
				<span class="nav-text visible-open fw-semibold small lh-1">[[themes/harmony:collapse]]</span>
			</a>
		</div>
	</div>
</nav>
