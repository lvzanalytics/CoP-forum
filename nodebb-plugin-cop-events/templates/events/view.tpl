<div class="event-view-page" component="events/view">
	<!-- Hero Banner -->
	<div class="event-hero-banner position-relative overflow-hidden mb-5" style="height: 400px; background-image: url('{{{ if event.bannerUrl }}}{event.bannerUrl}{{{ else }}}/assets/images/placeholder-event.png{{{ end }}}'); background-size: cover; background-position: center;">
		<div class="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end" style="background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);">
			<div class="container pb-5">
				<div class="row align-items-end">
					<div class="col-lg-8">
						<nav aria-label="breadcrumb">
							<ol class="breadcrumb mb-2">
								<li class="breadcrumb-item"><a href="{config.relative_path}/events" class="text-white-50 text-decoration-none">[[cop-events:events.title]]</a></li>
								{{{ if event.sector }}}
								<li class="breadcrumb-item active text-white" aria-current="page">{event.sector}</li>
								{{{ end }}}
							</ol>
						</nav>
						<h1 class="display-5 fw-bold text-white mb-3">{event.title}</h1>
						<div class="d-flex flex-wrap gap-4 text-white-50">
							<div class="d-flex align-items-center"><i class="fa fa-calendar me-2"></i> {event.startDateFormatted}</div>
							<div class="d-flex align-items-center"><i class="fa fa-clock-o me-2"></i> {event.startTimeFormatted}</div>
							{{{ if event.location }}}
							<div class="d-flex align-items-center"><i class="fa fa-map-marker me-2"></i> {event.location}</div>
							{{{ end }}}
						</div>
					</div>
					<div class="col-lg-4 text-lg-end d-none d-lg-block">
						{{{ if event.meetingLink }}}
						<a href="{event.meetingLink}" target="_blank" class="btn btn-primary btn-lg rounded-pill px-5 shadow-lg mb-2">
							<i class="fa fa-video-camera me-2"></i> [[cop-events:events.join]]
						</a>
						{{{ end }}}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="container mb-5">
		<div class="row g-5">
			<!-- Main Content -->
			<div class="col-lg-8">
				{{{ if canEdit }}}
				<div class="d-flex gap-2 mb-4">
					<a href="{config.relative_path}/events/{event.slug}/edit" class="btn btn-outline-secondary btn-sm rounded-pill px-3">
						<i class="fa fa-pencil me-1"></i> [[cop-events:events.edit]]
					</a>
					<button component="events/delete" class="btn btn-outline-danger btn-sm rounded-pill px-3">
						<i class="fa fa-trash me-1"></i> [[cop-events:events.delete]]
					</button>
				</div>
				{{{ end }}}

				<div class="event-description card border-0 shadow-sm p-4 p-md-5 glass-card mb-4">
					<h3 class="fw-bold mb-4">[[cop-events:events.description]]</h3>
					<div class="content text-secondary lh-lg">
						{event.description}
					</div>
				</div>

				{{{ if event.tid }}}
				<div class="card border-0 shadow-sm p-4 glass-card">
					<h3 class="fw-bold mb-3">[[cop-events:events.discussion]]</h3>
					<a href="{config.relative_path}/topic/{event.tid}" class="btn btn-outline-primary rounded-pill">
						<i class="fa fa-comments me-2"></i> [[cop-events:events.view_discussion]]
					</a>
				</div>
				{{{ end }}}
			</div>

			<!-- Sidebar -->
			<div class="col-lg-4">
				<div class="sticky-top" style="top: 80px; z-index: 10;">
					<div class="card border-0 shadow-lg p-4 glass-card mb-4">
						<div class="d-grid gap-3">
							{{{ if event.meetingLink }}}
							<a href="{event.meetingLink}" target="_blank" class="btn btn-primary rounded-pill py-3 fw-bold d-lg-none">
								<i class="fa fa-video-camera me-2"></i> [[cop-events:events.join]]
							</a>
							{{{ end }}}
							{{{ if event.registrationLink }}}
							<a href="{event.registrationLink}" target="_blank" class="btn btn-outline-primary rounded-pill py-3 fw-bold">
								<i class="fa fa-id-card-o me-2"></i> [[cop-events:events.register]]
							</a>
							{{{ end }}}

							{{{ if loggedIn }}}
							<button component="events/rsvp" class="btn {{{ if rsvpd }}}btn-primary{{{ else }}}btn-outline-primary{{{ end }}} rounded-pill py-3 fw-bold">
								{{{ if rsvpd }}}
								<i class="fa fa-check me-2"></i> [[cop-events:events.rsvp_cancel]]
								{{{ else }}}
								<i class="fa fa-hand-paper-o me-2"></i> [[cop-events:events.rsvp]]
								{{{ end }}}
							</button>
							<div class="text-center text-muted small">
								<span component="events/rsvp-count">{rsvpCount}</span> [[cop-events:events.participants]]
							</div>
							{{{ end }}}

							<hr class="my-2">
							<div class="d-flex align-items-center gap-3 mb-2">
								<div class="icon-box bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
									<i class="fa fa-globe text-primary"></i>
								</div>
								<div>
									<div class="small text-muted">[[cop-events:events.timezone]]</div>
									<div class="fw-semibold">Africa/Abidjan (WAT)</div>
								</div>
							</div>
							<div class="d-flex align-items-center gap-3 mb-2">
								<div class="icon-box bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
									<i class="fa fa-share-alt text-primary"></i>
								</div>
								<div>
									<div class="small text-muted">[[cop-events:events.share]]</div>
									<div class="d-flex gap-2 mt-1">
										<a component="share/linkedin" href="#" target="_blank" class="text-dark"><i class="fa fa-linkedin"></i></a>
										<a component="share/twitter" href="#" target="_blank" class="text-dark"><i class="fa fa-twitter"></i></a>
										<a component="share/facebook" href="#" target="_blank" class="text-dark"><i class="fa fa-facebook"></i></a>
									</div>
								</div>
							</div>
							<button component="events/add-to-calendar" class="btn btn-light rounded-pill mt-2">
								<i class="fa fa-calendar-plus-o me-2"></i> [[cop-events:events.add_to_calendar]]
							</button>
						</div>
					</div>

					{{{ if event.user.username }}}
					<div class="card border-0 shadow-sm p-4 glass-card">
						<h5 class="fw-bold mb-3">[[cop-events:events.organizer]]</h5>
						<div class="d-flex align-items-center gap-3">
							<a href="{config.relative_path}/user/{event.user.userslug}">
								{{{ if event.user.picture }}}
								<img src="{event.user.picture}" class="rounded-circle" width="48" height="48" alt="{event.user.username}" />
								{{{ else }}}
								<div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style="width: 48px; height: 48px;">{event.user.username}</div>
								{{{ end }}}
							</a>
							<div>
								<a href="{config.relative_path}/user/{event.user.userslug}" class="fw-semibold text-dark text-decoration-none">{event.user.username}</a>
							</div>
						</div>
					</div>
					{{{ end }}}
				</div>
			</div>
		</div>
	</div>
</div>
