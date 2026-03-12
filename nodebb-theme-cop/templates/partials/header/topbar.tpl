<div class="cop-topbar">
	<button class="cop-mobile-toggle" id="cop-mobile-toggle" aria-label="Toggle sidebar">
		<i class="fa fa-bars"></i>
	</button>

	<div class="cop-channel-info">
		{{{ if template.category }}}
		<span class="channel-hash-icon">#</span>
		<span class="channel-title">{name}</span>
		{{{ if ./descriptionParsed }}}
		<span class="channel-divider"></span>
		<span class="channel-description">{./descriptionParsed}</span>
		{{{ end }}}
		{{{ end }}}
		{{{ if template.topic }}}
		<span class="channel-hash-icon"><i class="fa fa-comments fa-sm"></i></span>
		<span class="channel-title">{title}</span>
		{{{ end }}}
		{{{ if (!template.category && !template.topic) }}}
		<span class="channel-hash-icon"><i class="fa fa-home fa-sm"></i></span>
		<span class="channel-title">{config.siteTitle}</span>
		{{{ end }}}
	</div>

	<div class="cop-toolbar">
		{{{ if config.loggedIn }}}
		<!-- Notifications dropdown -->
		<div component="notifications" class="dropdown" style="z-index: 1050;">
			<a data-bs-toggle="dropdown" href="#" role="button" class="toolbar-btn position-relative" aria-haspopup="true" aria-expanded="false" aria-label="[[global:header.notifications]]">
				<i component="notifications/icon" class="fa {{{ if unreadCount.notification}}}fa-bell{{{ else }}}fa-bell-o{{{ end }}}" data-content="{unreadCount.notification}"></i>
				<span component="notifications/count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger {{{ if !unreadCount.notification }}}hidden{{{ end }}}" style="font-size: 0.55rem; padding: 2px 4px;">{unreadCount.notification}</span>
			</a>
			<ul class="notifications-dropdown dropdown-menu dropdown-menu-end p-1 shadow" style="z-index: 1060; width: 360px; max-height: 500px; overflow-y: auto;" role="menu">
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

		<!-- Chats dropdown -->
		{{{ if canChat }}}
		<div class="dropdown" style="z-index: 1050;">
			<a data-bs-toggle="dropdown" href="#" role="button" class="toolbar-btn position-relative" component="chat/dropdown" aria-haspopup="true" aria-expanded="false" aria-label="[[global:header.chats]]">
				<i component="chat/icon" class="fa {{{ if unreadCount.chat}}}fa-comment{{{ else }}}fa-comment-o{{{ end }}}" data-content="{unreadCount.chat}"></i>
				<span component="chat/count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger {{{ if !unreadCount.chat }}}hidden{{{ end }}}" style="font-size: 0.55rem; padding: 2px 4px;">{unreadCount.chat}</span>
			</a>
			<ul class="chats-dropdown dropdown-menu dropdown-menu-end p-1 shadow" style="z-index: 1060; width: 360px; max-height: 500px; overflow-y: auto;" role="menu">
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
		{{{ end }}}

		<!-- Search -->
		<a href="{relative_path}/search" class="toolbar-btn" title="[[global:search]]">
			<i class="fa fa-search"></i>
		</a>

		<!-- User menu dropdown -->
		{{{ if config.loggedIn }}}
		<div class="dropdown" style="z-index: 1050;">
			<a component="header/avatar" id="user_dropdown" href="#" role="button" class="toolbar-btn" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="[[user:user-menu]]">
				{buildAvatar(user, "24px", true)}
			</a>
			<ul id="user-control-list" component="header/usercontrol" class="dropdown-menu dropdown-menu-end shadow p-1 text-sm" style="z-index: 1060;" role="menu">
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
		{{{ else }}}
		<a href="{relative_path}/login" class="toolbar-btn" title="[[global:login]]">
			<i class="fa fa-sign-in"></i>
		</a>
		{{{ end }}}
	</div>
</div>
