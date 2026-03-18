<header class="cop-navbar" id="cop-navbar">
	<!-- Left: Logo + Title -->
	<a href="{relative_path}/" class="cop-navbar__brand">
		{{{ if brand:logo }}}
		<img src="{brand:logo}?{config.cache-buster}" alt="{config.siteTitle}" class="cop-navbar__logo" />
		{{{ end }}}
		{{{ if !brand:logo }}}
		<img src="{relative_path}/plugins/nodebb-theme-cop/cop/logo.JPG" alt="{config.siteTitle}" class="cop-navbar__logo" />
		{{{ end }}}
		<span class="cop-navbar__title">{config.siteTitle}</span>
	</a>

	<!-- Center: Nav links -->
	<ul class="cop-navbar__nav">
		<li><a href="{relative_path}/" class="cop-nav-link" data-path="/">[[themes/cop:nav.home]]</a></li>
		<li class="cop-espaces-dropdown dropdown">
			<a href="#" class="cop-nav-link" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				[[themes/cop:nav.espaces]] <i class="fa fa-chevron-down"></i>
			</a>
			<div class="dropdown-menu p-2">
				{{{ each allCategories }}}
				<a href="{config.relative_path}/category/{allCategories.slug}" class="cop-espace-item">
					<span class="cop-espace-icon">
						{{{ if allCategories.icon }}}<i class="fa {allCategories.icon}"></i>{{{ else }}}#</span>{{{ end }}}
					</span>
					<div class="cop-espace-info">
						<div class="cop-espace-name">{allCategories.name}</div>
						{{{ if allCategories.descriptionParsed }}}
						<div class="cop-espace-desc">{allCategories.descriptionParsed}</div>
						{{{ end }}}
					</div>
				</a>
				{{{ end }}}
			</div>
		</li>
		<li><a href="{relative_path}/recent" class="cop-nav-link" data-path="/recent">[[themes/cop:nav.recent]]</a></li>
		<li><a href="{relative_path}/users" class="cop-nav-link" data-path="/users">[[themes/cop:nav.members]]</a></li>
	</ul>

	<!-- Right: Actions -->
	<div class="cop-navbar__actions">
		<!-- Search -->
		<a href="{relative_path}/search" class="cop-action-btn" title="[[global:search]]">
			<i class="fa fa-search"></i>
		</a>

		{{{ if config.loggedIn }}}
		<!-- Notifications -->
		<div component="notifications" class="dropdown">
			<a data-bs-toggle="dropdown" href="#" role="button" class="cop-action-btn" aria-haspopup="true" aria-expanded="false" aria-label="[[global:header.notifications]]">
				<i component="notifications/icon" class="fa {{{ if unreadCount.notification}}}fa-bell{{{ else }}}fa-bell-o{{{ end }}}"></i>
				<span component="notifications/count" class="badge rounded-pill {{{ if !unreadCount.notification }}}hidden{{{ end }}}">{unreadCount.notification}</span>
			</a>
			<ul class="notifications-dropdown dropdown-menu dropdown-menu-end p-1 shadow" role="menu">
				<li>
					<div component="notifications/list" class="list-container notification-list overscroll-behavior-contain pe-1 ff-base">
						<div class="mb-2 p-1">
							<div class="d-flex gap-1 justify-content-between">
								<div class="d-flex gap-2 flex-grow-1 placeholder-wave">
									<div class="placeholder" style="width: 32px; height: 32px;"></div>
									<div class="flex-grow-1">
										<div class="d-flex flex-column">
											<div class="text-sm">
												<span class="placeholder placeholder-sm col-4"></span>
												<span class="placeholder placeholder-sm col-6"></span>
											</div>
											<div class="text-xs">
												<div class="placeholder placeholder-xs col-6"></div>
											</div>
										</div>
									</div>
								</div>
								<div>
									<button class="mark-read btn btn-ghost btn-sm d-flex align-items-center justify-content-center p-1" style="width: 1.5rem; height: 1.5rem;">
										<i class="unread fa fa-2xs fa-circle text-primary"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</li>
				<li class="dropdown-divider"></li>
				<li>
					<div class="d-flex justify-content-center gap-1 flex-wrap">
						<a role="button" href="#" class="btn btn-sm btn-light mark-all-read flex-fill text-nowrap text-truncate ff-secondary"><i class="fa fa-check-double"></i> [[notifications:mark-all-read]]</a>
						<a class="btn btn-sm btn-primary flex-fill text-nowrap text-truncate ff-secondary" href="{relative_path}/notifications"><i class="fa fa-list"></i> [[notifications:see-all]]</a>
					</div>
				</li>
			</ul>
		</div>

		<!-- Chats -->
		{{{ if canChat }}}
		<div class="dropdown">
			<a data-bs-toggle="dropdown" href="#" role="button" class="cop-action-btn" component="chat/dropdown" aria-haspopup="true" aria-expanded="false" aria-label="[[global:header.chats]]">
				<i component="chat/icon" class="fa {{{ if unreadCount.chat}}}fa-comment{{{ else }}}fa-comment-o{{{ end }}}"></i>
				<span component="chat/count" class="badge rounded-pill {{{ if !unreadCount.chat }}}hidden{{{ end }}}">{unreadCount.chat}</span>
			</a>
			<ul class="chats-dropdown dropdown-menu dropdown-menu-end p-1 shadow" role="menu">
				<li>
					<div component="chat/list" class="list-container chats-list overscroll-behavior-contain p-0 pe-1 ff-base">
						<div class="rounded-1">
							<div class="d-flex gap-1 justify-content-between">
								<div class="dropdown-item p-2 d-flex gap-2 placeholder-wave">
									<div class="main-avatar">
										<div class="placeholder" style="width: 32px; height: 32px;"></div>
									</div>
									<div class="d-flex flex-grow-1 flex-column w-100">
										<div class="text-xs"><div class="placeholder col-3"></div></div>
										<div class="text-sm"><div class="placeholder col-11"></div></div>
										<div class="text-xs"><div class="placeholder col-4"></div></div>
									</div>
								</div>
								<div>
									<button class="mark-read btn btn-ghost btn-sm d-flex align-items-center justify-content-center p-1" style="width: 1.5rem; height: 1.5rem;">
										<i class="unread fa fa-2xs fa-circle text-primary"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</li>
				<li class="dropdown-divider"></li>
				<li>
					<div class="d-flex justify-content-center gap-1 flex-wrap">
						<a component="chats/mark-all-read" role="button" href="#" class="btn btn-sm btn-light mark-all-read flex-fill text-nowrap text-truncate ff-secondary"><i class="fa fa-check-double"></i> [[modules:chat.mark-all-read]]</a>
						<a class="btn btn-sm btn-primary flex-fill text-nowrap text-truncate ff-secondary" href="{relative_path}/user/{user.userslug}/chats"><i class="fa fa-list"></i> [[modules:chat.see-all]]</a>
					</div>
				</li>
			</ul>
		</div>
		{{{ end }}}

		<!-- User menu -->
		<div class="dropdown">
			<a component="header/avatar" id="user_dropdown" href="#" role="button" class="cop-action-btn" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="[[user:user-menu]]">
				{buildAvatar(user, "28px", true)}
			</a>
			<ul id="user-control-list" component="header/usercontrol" class="dropdown-menu dropdown-menu-end shadow p-1 text-sm" role="menu">
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" component="header/profilelink" href="{relative_path}/user/{user.userslug}" role="menuitem">
						<span component="user/status" class="flex-shrink-0 border border-white border-2 rounded-circle status {user.status}"></span>
						<span class="fw-semibold" component="header/username">{user.username}</span>
					</a>
				</li>
				<li role="presentation" class="dropdown-divider"></li>
				<li><h6 class="dropdown-header text-xs">[[global:status]]</h6></li>
				<li>
					<a href="#" class="dropdown-item rounded-1 user-status d-flex align-items-center gap-2 {{{ if user.online }}}selected{{{ end }}}" data-status="online" role="menuitem">
						<span class="flex-shrink-0 border border-white border-2 rounded-circle status online"></span>
						<span class="flex-grow-1">[[global:online]]</span>
						<i class="fa-solid fa-check text-secondary flex-shrink-0"></i>
					</a>
				</li>
				<li>
					<a href="#" class="dropdown-item rounded-1 user-status d-flex align-items-center gap-2 {{{ if user.away }}}selected{{{ end }}}" data-status="away" role="menuitem">
						<span class="flex-shrink-0 border border-white border-2 rounded-circle status away"></span>
						<span class="flex-grow-1">[[global:away]]</span>
						<i class="fa-solid fa-check text-secondary flex-shrink-0"></i>
					</a>
				</li>
				<li>
					<a href="#" class="dropdown-item rounded-1 user-status d-flex align-items-center gap-2 {{{ if user.dnd }}}selected{{{ end }}}" data-status="dnd" role="menuitem">
						<span class="flex-shrink-0 border border-white border-2 rounded-circle status dnd"></span>
						<span class="flex-grow-1">[[global:dnd]]</span>
						<i class="fa-solid fa-check text-secondary flex-shrink-0"></i>
					</a>
				</li>
				<li>
					<a href="#" class="dropdown-item rounded-1 user-status d-flex align-items-center gap-2 {{{ if user.offline }}}selected{{{ end }}}" data-status="offline" role="menuitem">
						<span class="flex-shrink-0 border border-white border-2 rounded-circle status offline"></span>
						<span class="flex-grow-1">[[global:invisible]]</span>
						<i class="fa-solid fa-check text-secondary flex-shrink-0"></i>
					</a>
				</li>
				<li role="presentation" class="dropdown-divider"></li>
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" href="{relative_path}/user/{user.userslug}/bookmarks" role="menuitem">
						<i class="fa fa-fw fa-bookmark text-secondary"></i> <span>[[user:bookmarks]]</span>
					</a>
				</li>
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" component="header/profilelink/edit" href="{relative_path}/user/{user.userslug}/edit" role="menuitem">
						<i class="fa fa-fw fa-edit text-secondary"></i> <span>[[user:edit-profile]]</span>
					</a>
				</li>
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" component="header/profilelink/settings" href="{relative_path}/user/{user.userslug}/settings" role="menuitem">
						<i class="fa fa-fw fa-gear text-secondary"></i> <span>[[user:settings]]</span>
					</a>
				</li>
				{{{ if showModMenu }}}
				<li role="presentation" class="dropdown-divider"></li>
				<li><h6 class="dropdown-header text-xs">[[pages:moderator-tools]]</h6></li>
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" href="{relative_path}/flags" role="menuitem">
						<i class="fa fa-fw fa-flag text-secondary"></i> <span>[[pages:flagged-content]]</span>
					</a>
				</li>
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" href="{relative_path}/post-queue" role="menuitem">
						<i class="fa fa-fw fa-list-alt text-secondary"></i> <span>[[pages:post-queue]]</span>
					</a>
				</li>
				{{{ if registrationQueueEnabled }}}
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" href="{relative_path}/registration-queue" role="menuitem">
						<i class="fa fa-fw fa-list-alt text-secondary"></i> <span>[[pages:registration-queue]]</span>
					</a>
				</li>
				{{{ end }}}
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" href="{relative_path}/ip-blacklist" role="menuitem">
						<i class="fa fa-fw fa-ban text-secondary"></i> <span>[[pages:ip-blacklist]]</span>
					</a>
				</li>
				{{{ else }}}
				{{{ if postQueueEnabled }}}
				<li>
					<a class="dropdown-item rounded-1 d-flex align-items-center gap-2" href="{relative_path}/post-queue" role="menuitem">
						<i class="fa fa-fw fa-list-alt text-secondary"></i> <span>[[pages:post-queue]]</span>
					</a>
				</li>
				{{{ end }}}
				{{{ end }}}
				<li role="presentation" class="dropdown-divider"></li>
				<li component="user/logout">
					<form method="post" action="{relative_path}/logout" role="menuitem">
						<input type="hidden" name="_csrf" value="{config.csrf_token}">
						<input type="hidden" name="noscript" value="true">
						<button type="submit" class="dropdown-item rounded-1 d-flex align-items-center gap-2">
							<i class="fa fa-fw fa-sign-out text-secondary"></i><span>[[global:logout]]</span>
						</button>
					</form>
				</li>
			</ul>
		</div>
		{{{ end }}}

		{{{ if !config.loggedIn }}}
		<a href="{relative_path}/login" class="cop-action-btn" title="[[global:login]]">
			<i class="fa fa-sign-in"></i>
		</a>
		{{{ end }}}
	</div>

	<!-- Mobile toggle -->
	<button class="cop-navbar__mobile-toggle" id="cop-mobile-toggle" aria-label="Toggle menu">
		<i class="fa fa-bars"></i>
	</button>
</header>
