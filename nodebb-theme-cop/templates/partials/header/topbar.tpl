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
		<a href="{relative_path}/notifications" class="toolbar-btn position-relative" title="[[global:notifications]]">
			<i class="fa fa-bell"></i>
			<span component="notifications/count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger {{{ if !unreadCount.notification }}}hidden{{{ end }}}" style="font-size: 0.6rem;">{unreadCount.notification}</span>
		</a>
		<a href="{relative_path}/chats" class="toolbar-btn position-relative" title="[[global:header.chats]]">
			<i class="fa fa-envelope"></i>
			<span component="chat/icon/unread" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger {{{ if !unreadCount.chat }}}hidden{{{ end }}}" style="font-size: 0.6rem;">{unreadCount.chat}</span>
		</a>
		{{{ end }}}
		<a href="{relative_path}/search" class="toolbar-btn" title="[[global:search]]">
			<i class="fa fa-search"></i>
		</a>
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
