<div class="events-page" component="events/list">
	<div class="container">
		<!-- Hero Section -->
		<div class="events-hero mb-5 pt-4 text-center">
			<h1 class="fw-bold tracking-tight mb-2">[[cop-events:events.title]]</h1>
			<p class="text-muted lead mx-auto" style="max-width: 600px;">
				[[cop-events:events.subtitle]]
			</p>
		</div>

		<!-- Toolbar -->
		<div class="events-toolbar d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
			<div class="d-flex align-items-center gap-2">
				<div class="btn-group rounded-pill overflow-hidden shadow-sm bg-white p-1">
					<a href="{config.relative_path}/events" class="btn btn-sm px-3 rounded-pill {{{ if (view == "list") }}}btn-primary{{{ else }}}btn-link text-dark text-decoration-none{{{ end }}}">
						<i class="fa fa-list me-1"></i> [[cop-events:events.list]]
					</a>
					<a href="{config.relative_path}/events/calendar" class="btn btn-sm px-3 rounded-pill btn-link text-dark text-decoration-none">
						<i class="fa fa-calendar me-1"></i> [[cop-events:events.calendar]]
					</a>
				</div>
				<div class="btn-group rounded-pill overflow-hidden shadow-sm bg-white p-1 ms-2">
					<a href="{config.relative_path}/events?tab=upcoming" class="btn btn-sm px-3 rounded-pill {{{ if (tab == "upcoming") }}}btn-outline-primary{{{ else }}}btn-link text-dark text-decoration-none{{{ end }}}">
						[[cop-events:events.upcoming]]
					</a>
					<a href="{config.relative_path}/events?tab=past" class="btn btn-sm px-3 rounded-pill {{{ if (tab == "past") }}}btn-outline-primary{{{ else }}}btn-link text-dark text-decoration-none{{{ end }}}">
						[[cop-events:events.past]]
					</a>
				</div>
			</div>

			<div class="d-flex flex-wrap align-items-center gap-2 flex-grow-1 flex-lg-grow-0">
				<div class="input-group input-group-sm shadow-sm" style="min-width: 250px;">
					<span class="input-group-text bg-white border-end-0"><i class="fa fa-search text-muted"></i></span>
					<input type="text" class="form-control border-start-0 ps-0" component="events/search" placeholder="[[cop-events:events.search_placeholder]]" value="{filters.q}" />
				</div>
				{{{ if loggedIn }}}
				<a href="{config.relative_path}/events/create" class="btn btn-primary btn-sm rounded-pill shadow-sm px-3">
					<i class="fa fa-plus me-1"></i> [[cop-events:events.create]]
				</a>
				{{{ end }}}
			</div>
		</div>

		<!-- List Content -->
		<div class="row g-4">
			{{{ if !events.length }}}
			<div class="col-12">
				<div class="alert alert-info text-center py-5">
					<i class="fa fa-calendar-o fa-3x mb-3 text-muted"></i>
					<p class="mb-0">[[cop-events:events.no_events]]</p>
				</div>
			</div>
			{{{ end }}}

			{{{ each events }}}
			<div class="col-12">
				<a href="{config.relative_path}/events/{../slug}" class="text-decoration-none">
					<div class="event-card card border-0 shadow-sm overflow-hidden h-100 glass-card" data-event-id="{../eventId}">
						<div class="row g-0">
							<div class="col-auto d-none d-md-block">
								<div class="event-date-block d-flex flex-column align-items-center justify-content-center h-100 p-4 bg-light">
									<span class="event-day fw-bold text-primary h3 mb-0">{../day}</span>
									<span class="event-month text-muted text-uppercase small ls-wide">{../month}</span>
								</div>
							</div>
							<div class="col">
								<div class="card-body p-4">
									<div class="d-flex flex-column h-100">
										<div class="mb-2">
											{{{ if ../sector }}}
											<span class="badge bg-accent-light text-accent rounded-pill mb-2 px-3 py-2">{../sector}</span>
											{{{ end }}}
											{{{ if ../region }}}
											<span class="ms-2 text-muted small"><i class="fa fa-map-marker me-1"></i> {../region}</span>
											{{{ end }}}
										</div>
										<h4 class="card-title fw-semibold text-dark mb-2">{../title}</h4>
										<p class="card-text text-secondary mb-3 line-clamp-2">
											{../description}
										</p>
										<div class="mt-auto d-flex align-items-center gap-3 text-muted small">
											<span><i class="fa fa-clock-o me-1"></i> {../startTimeFormatted}</span>
											{{{ if ../location }}}
											<span><i class="fa fa-laptop me-1"></i> {../location}</span>
											{{{ end }}}
											{{{ if ../meetingPlatform }}}
											<span><i class="fa fa-video-camera me-1"></i> {../meetingPlatform}</span>
											{{{ end }}}
										</div>
									</div>
								</div>
							</div>
							{{{ if ../bannerUrl }}}
							<div class="col-md-3 d-none d-lg-block">
								<div class="event-card-banner h-100" style="background-image: url('{../bannerUrl}'); background-size: cover; background-position: center; min-height: 180px;">
									<div class="banner-overlay h-100 w-100 d-flex align-items-center justify-content-center opacity-0">
										<span class="btn btn-light btn-sm rounded-pill shadow-sm">[[cop-events:events.details]]</span>
									</div>
								</div>
							</div>
							{{{ end }}}
						</div>
					</div>
				</a>
			</div>
			{{{ end }}}
		</div>

		<!-- Pagination -->
		<!-- IMPORT partials/paginator.tpl -->
	</div>
</div>
