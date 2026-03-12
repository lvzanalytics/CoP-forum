<!-- IMPORT partials/breadcrumbs-json-ld.tpl -->
{{{ if widgets.header.length }}}
<div data-widget-area="header">
{{{each widgets.header}}}
{{widgets.header.html}}
{{{end}}}
</div>
{{{ end }}}

<div class="cop-topic-view flex-fill d-flex flex-column" itemid="{url}" itemscope itemtype="https://schema.org/DiscussionForumPosting">
	<meta itemprop="headline" content="{escape(titleRaw)}">
	<meta itemprop="text" content="{escape(titleRaw)}">
	<meta itemprop="url" content="{url}">
	<meta itemprop="datePublished" content="{timestampISO}">
	<meta itemprop="dateModified" content="{lastposttimeISO}">
	<div itemprop="author" itemscope itemtype="https://schema.org/Person">
		<meta itemprop="name" content="{author.username}">
		{{{ if author.userslug }}}<meta itemprop="url" content="{config.relative_path}/user/{author.userslug}">{{{ end }}}
	</div>
	<div itemprop="interactionStatistic" itemscope itemtype="https://schema.org/InteractionCounter">
		<meta itemprop="interactionType" content="https://schema.org/CommentAction">
		<meta itemprop="userInteractionCount" content="{increment(postcount, "-1")}">
	</div>
	<div itemprop="interactionStatistic" itemscope itemtype="https://schema.org/InteractionCounter">
		<meta itemprop="interactionType" content="https://schema.org/LikeAction">
		<meta itemprop="userInteractionCount" content="{upvotes}">
	</div>

	<!-- Topic header -->
	<div class="cop-topic-header px-4 py-3 border-bottom" >
		<div class="d-flex flex-column gap-2">
			<div class="d-flex align-items-center gap-2 flex-wrap">
				<h1 component="post/header" class="fs-5 fw-bold mb-0 text-break">
					<span class="topic-title" component="topic/title">{title}</span>
				</h1>
				<span component="topic/labels" class="d-flex gap-1 {{{ if (!scheduled && (!pinned && (!locked && (!icons.length && (!oldCid || (oldCid == "-1")))))) }}}hidden{{{ end }}}">
					<span component="topic/scheduled" class="badge bg-warning bg-opacity-25 text-warning border-0 {{{ if !scheduled }}}hidden{{{ end }}}">
						<i class="fa fa-clock-o"></i> [[topic:scheduled]]
					</span>
					<span component="topic/pinned" class="badge bg-info bg-opacity-25 text-info border-0 {{{ if (scheduled || !pinned) }}}hidden{{{ end }}}">
						<i class="fa fa-thumb-tack"></i> [[topic:pinned]]
					</span>
					<span component="topic/locked" class="badge bg-danger bg-opacity-25 text-danger border-0 {{{ if !locked }}}hidden{{{ end }}}">
						<i class="fa fa-lock"></i> [[topic:locked]]
					</span>
					{{{each icons}}}<span class="lh-1">{@value}</span>{{{end}}}
				</span>
			</div>
			<div class="d-flex gap-2 align-items-center flex-wrap">
				{buildCategoryLabel(category, "a", "border-0")}
				<div data-tid="{./tid}" component="topic/tags" class="tag-list d-flex flex-wrap gap-1"><!-- IMPORT partials/topic/tags.tpl --></div>
				<div class="d-flex gap-2" component="topic/stats"><!-- IMPORT partials/topic/stats.tpl --></div>
			</div>
		</div>
	</div>

	<!-- Messages area -->
	<div class="flex-fill" style="overflow-y: auto;">
		<!-- IMPORT partials/post_bar.tpl -->
		{{{ if merger }}}
		<!-- IMPORT partials/topic/merged-message.tpl -->
		{{{ end }}}
		{{{ if forker }}}
		<!-- IMPORT partials/topic/forked-message.tpl -->
		{{{ end }}}
		{{{ if !scheduled }}}
		<!-- IMPORT partials/topic/deleted-message.tpl -->
		{{{ end }}}

		<ul component="topic" class="posts timeline list-unstyled p-0" style="min-width: 0;" data-tid="{tid}" data-cid="{cid}">
		{{{ each posts }}}
			<li component="post" class="{{{ if posts.deleted }}}deleted{{{ end }}} {{{ if posts.selfPost }}}self-post{{{ end }}} {{{ if posts.topicOwnerPost }}}topic-owner-post{{{ end }}}" <!-- IMPORT partials/data/topic.tpl -->>
				<a component="post/anchor" data-index="{./index}" id="{increment(./index, "1")}"></a>
				<meta itemprop="datePublished" content="{./timestampISO}">
				{{{ if ./editedISO }}}
				<meta itemprop="dateModified" content="{./editedISO}">
				{{{ end }}}

				<!-- IMPORT partials/topic/post.tpl -->
			</li>
			{{{ if (config.topicPostSort != "most_votes") }}}
			{{{ each ./events}}}<!-- IMPORT partials/topic/event.tpl -->{{{ end }}}
			{{{ end }}}
		{{{ end }}}
		</ul>

		{{{ if browsingUsers }}}
		<div class="px-4 py-2">
			<!-- IMPORT partials/topic/browsing-users.tpl -->
		</div>
		{{{ end }}}

		{{{ if config.theme.enableQuickReply }}}
		<!-- IMPORT partials/topic/quickreply.tpl -->
		{{{ end }}}

		{{{ if !config.loggedIn }}}
		<!-- IMPORT partials/topic/guest-cta.tpl -->
		{{{ end }}}

		{{{ if config.usePagination }}}
		<div class="px-4 py-2">
		<!-- IMPORT partials/paginator.tpl -->
		</div>
		{{{ end }}}
	</div>
</div>

<div data-widget-area="footer">
{{{each widgets.footer}}}
{{widgets.footer.html}}
{{{end}}}
</div>

{{{ if !config.usePagination }}}
<noscript>
<!-- IMPORT partials/paginator.tpl -->
</noscript>
{{{ end }}}
