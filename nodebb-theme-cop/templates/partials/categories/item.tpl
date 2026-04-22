<li component="categories/category" data-cid="{./cid}" class="cop-channel-card category-{./cid} {./unread-class}">
	<meta itemprop="name" content="{./name}">

	<div class="cop-channel-accent"></div>

	<div class="cop-channel-body">
		<div class="cop-channel-top">
			<div class="cop-channel-icon-wrap">
				<span class="cop-channel-icon"></span>
				{{{ if ./unread }}}
				<span class="cop-channel-unread-dot"></span>
				{{{ end }}}
			</div>
			<div class="cop-channel-info">
				<h2 class="cop-channel-name">
					<a href="{config.relative_path}/category/{./slug}" class="stretched-link">{./name}</a>
				</h2>
				{{{ if ./descriptionParsed }}}
				<p class="cop-channel-desc">{./descriptionParsed}</p>
				{{{ end }}}
			</div>
		</div>

		{{{ if !config.hideSubCategories }}}
		{{{ if ./children.length }}}
		<div class="cop-channel-children">
			{{{ each ./children }}}
			{{{ if !./isSection }}}
			<a href="{config.relative_path}/category/{./slug}" class="cop-subchannel">
				{{{ if ./icon }}}<i class="fa {./icon} fa-sm"></i>{{{ end }}}
				{./name}
			</a>
			{{{ end }}}
			{{{ end }}}
		</div>
		{{{ end }}}
		{{{ end }}}

		{{{ if !./link }}}
		<div class="cop-channel-footer">
			<div class="cop-channel-stats">
				<span><i class="fa fa-message fa-sm"></i> {humanReadableNumber(./totalTopicCount, 0)}</span>
				<span class="cop-stat-sep">&middot;</span>
				<span><i class="fa fa-comments fa-sm"></i> {humanReadableNumber(./totalPostCount, 0)}</span>
			</div>
			{{{ if ./teaser.pid }}}
			<div class="cop-channel-activity">
				<span class="timeago" title="{./teaser.timestampISO}"></span>
			</div>
			{{{ end }}}
		</div>
		{{{ end }}}
	</div>
</li>
