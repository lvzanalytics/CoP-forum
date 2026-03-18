<div class="account cop-account w-100 mx-auto">
	<!-- Profile banner -->
	<div class="cop-profile-banner" component="account/cover" style="background-image: url({cover:url}); background-position: {cover:position};">
		{{{ if allowCoverPicture }}}
		{{{ if canEdit }}}
		<div class="controls text-center">
			<a href="#" class="upload p-2 m-2 rounded-1 text-bg-light opacity-75"><i class="fa fa-fw fa-upload"></i></a>
			<a href="#" class="resize p-2 m-2 rounded-1 text-bg-light opacity-75"><i class="fa fa-fw fa-arrows"></i></a>
			<a href="#" class="remove p-2 m-2 rounded-1 text-bg-light opacity-75"><i class="fa fa-fw fa-times"></i></a>
		</div>
		<a href="#" class="save btn btn-primary">[[groups:cover-save]] <i class="fa fa-fw fa-floppy-o"></i></a>
		<div class="indicator text-bg-primary">[[groups:cover-saving]] <i class="fa fa-fw fa-refresh fa-spin"></i></div>
		{{{ end }}}
		{{{ end }}}
	</div>

	<!-- Profile card -->
	<div class="cop-profile-card">
		<div class="d-flex flex-column flex-md-row gap-3 align-items-center align-items-md-end">
			<div {{{ if (allowProfilePicture && isSelfOrAdminOrGlobalModerator)}}}component="profile/change/picture"{{{ end }}} class="avatar-wrapper cop-avatar-wrapper hover-parent">
				{buildAvatar(@value, "96px", true)}
				{{{ if (allowProfilePicture && isSelfOrAdminOrGlobalModerator)}}}
				<a href="#" component="profile/change/picture" class="cop-avatar-edit d-none d-md-flex">
					<i class="fa fa-fw fa-camera"></i>
				</a>
				{{{ end }}}
			</div>

			<div class="flex-grow-1 text-center text-md-start">
				<h2 class="cop-display-name mb-0">{{{ if fullname }}}{fullname}{{{ else }}}{username}{{{ end }}}</h2>
				<div class="cop-username">
					{{{ if !banned }}}@{username}{{{ else }}}[[user:banned]]{{{ end }}}
					{{{ if selectedGroup.length }}}
					<span class="d-inline-flex gap-1 ms-2">
						{{{ each selectedGroup }}}
						{{{ if ./slug }}}
						<!-- IMPORT partials/groups/badge.tpl -->
						{{{ end }}}
						{{{ end }}}
					</span>
					{{{ end }}}
				</div>
				<div class="d-flex gap-2 mt-1 justify-content-center justify-content-md-start" component="user/badges"></div>
				{{{ if isAdminOrGlobalModeratorOrModerator }}}
				{{{ if banned }}}
				<div class="text-sm text-danger mt-1">
					{{{ if banned_until }}}
					[[user:info.banned-until, {isoTimeToLocaleString(./banned_until_readable, config.userLang)}]]
					{{{ else }}}
					[[user:info.banned-permanently]]
					{{{ end }}}
				</div>
				{{{ end }}}
				{{{ end }}}
			</div>

			<div class="d-flex gap-2 flex-shrink-0">
				{{{ if loggedIn }}}
				{{{ if !isSelf }}}
				<a component="account/unfollow" href="#" class="btn btn-sm btn-outline-warning{{{ if (!isFollowing && !isFollowPending) }}} hide{{{ end }}}">[[user:{{{ if isFollowPending }}}cancel-follow{{{ else }}}unfollow{{{ end }}}]]</a>
				<a component="account/follow" href="#" class="btn btn-sm btn-primary{{{ if (isFollowing || isFollowPending) }}} hide{{{ end }}}">[[user:follow]]</a>
				{{{ end }}}
				{{{ end }}}

				{{{ if (canChat && !banned) }}}
				<div class="btn-group">
					<a {{{ if hasPrivateChat }}}component="account/chat"{{{ else }}}component="account/new-chat"{{{ end }}} href="#" class="btn btn-sm btn-light" role="button"><i class="fa fa-comment-o me-1"></i>[[user:chat]]</a>
					{{{ if hasPrivateChat}}}
					<button type="button" class="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i class="fa fa-caret-down"></i>
					</button>
					<ul class="dropdown-menu dropdown-menu-end p-1 text-sm" role="menu">
						<li><a class="dropdown-item rounded-1" href="#" component="account/new-chat" role="menuitem">[[user:new-chat-with, {username}]]</a></li>
					</ul>
					{{{ end }}}
				</div>
				{{{ end }}}
				{{{ if !isSelf }}}
				{{{ if (isAdmin || (canBan || canMute ))}}}
				<!-- IMPORT partials/account/admin-menu.tpl -->
				{{{ end }}}
				{{{ end }}}
			</div>
		</div>
	</div>

	<div data-widget-area="header">
		{{{each widgets.header}}}
		{{widgets.header.html}}
		{{{end}}}
	</div>

	<!-- Content area with sidebar nav -->
	<div class="d-flex flex-column flex-md-row mt-3">
		<!-- IMPORT partials/account/sidebar-left.tpl -->
		<div class="account-content flex-grow-1 ps-md-3" style="min-width: 0;">
