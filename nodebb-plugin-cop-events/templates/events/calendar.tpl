<div class="events-page" component="events/calendar">
	<div class="container">
		<!-- Hero Section -->
		<div class="events-hero mb-5 pt-4 text-center">
			<h1 class="fw-bold tracking-tight mb-2">[[cop-events:events.title]]</h1>
			<p class="text-muted lead mx-auto" style="max-width: 600px;">
				[[cop-events:events.calendar_subtitle]]
			</p>
		</div>

		<!-- Toolbar -->
		<div class="events-toolbar d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
			<div class="d-flex align-items-center gap-2">
				<div class="btn-group rounded-pill overflow-hidden shadow-sm bg-white p-1">
					<a href="{config.relative_path}/events" class="btn btn-sm px-3 rounded-pill btn-link text-dark text-decoration-none">
						<i class="fa fa-list me-1"></i> [[cop-events:events.list]]
					</a>
					<a href="{config.relative_path}/events/calendar" class="btn btn-sm px-3 rounded-pill btn-primary">
						<i class="fa fa-calendar me-1"></i> [[cop-events:events.calendar]]
					</a>
				</div>
			</div>

			<div class="d-flex align-items-center gap-2">
				<div class="calendar-nav d-flex align-items-center gap-3 bg-white shadow-sm rounded-pill px-3 py-1">
					<a href="{prevUrl}" class="btn btn-link text-dark p-1"><i class="fa fa-chevron-left"></i></a>
					<span class="fw-semibold">{monthName} {year}</span>
					<a href="{nextUrl}" class="btn btn-link text-dark p-1"><i class="fa fa-chevron-right"></i></a>
				</div>
				{{{ if canManage }}}
				<a href="{config.relative_path}/events/create" class="btn btn-primary btn-sm rounded-pill shadow-sm px-3">
					<i class="fa fa-plus me-1"></i> [[cop-events:events.create]]
				</a>
				{{{ end }}}
			</div>
		</div>

		<!-- Calendar Grid -->
		<div class="calendar-container card border-0 shadow-lg overflow-hidden glass-card">
			<div class="calendar-header bg-light border-bottom py-3">
				<div class="row g-0 text-center fw-bold text-muted small text-uppercase ls-wide">
					{{{ each daysOfWeek }}}
					<div class="col">{@value}</div>
					{{{ end }}}
				</div>
			</div>
			<div class="calendar-body">
				{{{ each weeks }}}
				<div class="row g-0 border-bottom calendar-row">
					{{{ each ../days }}}
					<div class="col calendar-cell {{{ if !../isCurrentMonth }}}muted-day{{{ end }}} {{{ if ../hasEvent }}}has-event{{{ end }}} {{{ if ../isToday }}}is-today{{{ end }}}">
						<div class="cell-head">
							<span class="day-number">{../dayNum}</span>
						</div>
						<div class="day-events">
							{{{ each ../events }}}
							<a href="{config.relative_path}/events/{../slug}" class="event-chip {../sectorClass}" title="{../title}">
								{{{ if ../time }}}<span class="chip-time">{../time}</span>{{{ end }}}
								<span class="chip-title">{../title}</span>
							</a>
							{{{ end }}}
							{{{ if ../moreCount }}}
							<button type="button" class="event-more" data-bs-toggle="popover">+{../moreCount} [[cop-events:events.more_suffix]]</button>
							<div class="day-popover-content d-none">
								<div class="popover-day-title">{../dayNum} {monthName} {year}</div>
								{{{ each ../allEvents }}}
								<a href="{config.relative_path}/events/{../slug}" class="popover-event {../sectorClass}">
									{{{ if ../time }}}<span class="chip-time">{../time}</span>{{{ end }}}
									<span class="chip-title">{../title}</span>
								</a>
								{{{ end }}}
							</div>
							{{{ end }}}
						</div>
					</div>
					{{{ end }}}
				</div>
				{{{ end }}}
			</div>
		</div>
	</div>
</div>
