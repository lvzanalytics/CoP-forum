<div class="event-form-page" component="events/form">
	<div class="container py-4">
		<div class="row justify-content-center">
			<div class="col-lg-10">
				<div class="d-flex align-items-center justify-content-between mb-4">
					<h2 class="fw-bold tracking-tight mb-0">{title}</h2>
					<a href="{config.relative_path}/events" class="btn btn-link text-muted text-decoration-none">
						<i class="fa fa-times me-1"></i> [[cop-events:events.cancel]]
					</a>
				</div>

				<div class="card border-0 shadow-lg glass-card p-4 p-md-5">
					<form id="event-edit-form" role="form" enctype="multipart/form-data">
						{{{ if !isNew }}}
						<input type="hidden" name="eventId" value="{event.eventId}" />
						{{{ end }}}
						<div class="row g-4">
							<!-- Basic Info -->
							<div class="col-12">
								<label class="form-label fw-semibold" for="event-title">[[cop-events:events.title]]</label>
								<input type="text" id="event-title" name="title" class="form-control form-control-lg rounded-3" value="{event.title}" placeholder="[[cop-events:events.title_placeholder]]" required />
							</div>

							<div class="col-md-4">
								<label class="form-label fw-semibold" for="event-sector">[[cop-events:events.filter_sector]]</label>
								<select id="event-sector" name="sector" class="form-select rounded-3">
									<option value="Méthodologie" {{{ if (event.sector == "Méthodologie") }}}selected{{{ end }}}>Méthodologie</option>
									<option value="Formation" {{{ if (event.sector == "Formation") }}}selected{{{ end }}}>Formation</option>
									<option value="Politique" {{{ if (event.sector == "Politique") }}}selected{{{ end }}}>Politique</option>
									<option value="Étude de cas" {{{ if (event.sector == "Étude de cas") }}}selected{{{ end }}}>Étude de cas</option>
								</select>
							</div>

							<div class="col-md-4">
								<label class="form-label fw-semibold" for="event-region">[[cop-events:events.filter_region]]</label>
								<input type="text" id="event-region" name="region" class="form-control rounded-3" value="{event.region}" placeholder="Ex: Abidjan, Yamoussoukro..." />
							</div>

							<div class="col-md-4">
								<label class="form-label fw-semibold" for="event-location">[[cop-events:events.location]]</label>
								<input type="text" id="event-location" name="location" class="form-control rounded-3" value="{event.location}" placeholder="Ex: Zoom, Teams, Salle 101..." />
							</div>

							<!-- Banner -->
							<div class="col-12">
								<label class="form-label fw-semibold">[[cop-events:events.banner]]</label>
								<div class="event-banner-upload border-dashed rounded-3 p-5 text-center bg-light position-relative">
									<input type="file" id="event-banner" name="banner" accept="image/*" class="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" />
									<i class="fa fa-cloud-upload fa-3x text-muted mb-3"></i>
									<p class="mb-0 text-muted">[[cop-events:events.banner_help]]</p>
									<div id="banner-preview" class="mt-3 {{{ if !event.bannerUrl }}}d-none{{{ end }}}">
										<img src="{event.bannerUrl}" class="img-fluid rounded shadow-sm" style="max-height: 200px;" />
									</div>
								</div>
							</div>

							<!-- Date & Time -->
							<div class="col-md-4">
								<label class="form-label fw-semibold" for="event-start-date">[[cop-events:events.start_date]]</label>
								<input type="date" id="event-start-date" name="startDate" class="form-control rounded-3" value="{event.startDateISO}" required />
							</div>
							<div class="col-md-2">
								<label class="form-label fw-semibold" for="event-start-time">[[cop-events:events.time]]</label>
								<input type="time" id="event-start-time" name="startTime" class="form-control rounded-3" value="{event.startTime}" required />
							</div>
							<div class="col-md-4">
								<label class="form-label fw-semibold" for="event-end-date">[[cop-events:events.end_date]]</label>
								<input type="date" id="event-end-date" name="endDate" class="form-control rounded-3" value="{event.endDateISO}" />
							</div>
							<div class="col-md-2">
								<label class="form-label fw-semibold" for="event-end-time">[[cop-events:events.time]]</label>
								<input type="time" id="event-end-time" name="endTime" class="form-control rounded-3" value="{event.endTime}" />
							</div>

							<!-- Meeting Platform & Links -->
							<div class="col-md-4">
								<label class="form-label fw-semibold" for="event-platform">[[cop-events:events.platform]]</label>
								<select id="event-platform" name="meetingPlatform" class="form-select rounded-3">
									<option value="">--</option>
									<option value="Zoom" {{{ if (event.meetingPlatform == "Zoom") }}}selected{{{ end }}}>Zoom</option>
									<option value="Microsoft Teams" {{{ if (event.meetingPlatform == "Microsoft Teams") }}}selected{{{ end }}}>Microsoft Teams</option>
									<option value="Autre" {{{ if (event.meetingPlatform == "Autre") }}}selected{{{ end }}}>[[cop-events:events.platform_other]]</option>
								</select>
							</div>

							<div class="col-md-4">
								<label class="form-label fw-semibold" for="event-meeting-link">[[cop-events:events.meeting_link]]</label>
								<div class="input-group">
									<span class="input-group-text bg-white"><i class="fa fa-video-camera text-muted"></i></span>
									<input type="url" id="event-meeting-link" name="meetingLink" class="form-control rounded-end-3" value="{event.meetingLink}" placeholder="https://..." />
								</div>
							</div>

							<div class="col-md-4">
								<label class="form-label fw-semibold" for="event-registration-link">[[cop-events:events.registration_link]]</label>
								<div class="input-group">
									<span class="input-group-text bg-white"><i class="fa fa-id-card-o text-muted"></i></span>
									<input type="url" id="event-registration-link" name="registrationLink" class="form-control rounded-end-3" value="{event.registrationLink}" placeholder="https://..." />
								</div>
							</div>

							<!-- Description -->
							<div class="col-12">
								<label class="form-label fw-semibold" for="event-description">[[cop-events:events.description]]</label>
								<textarea id="event-description" name="description" class="form-control rounded-3" rows="8" placeholder="[[cop-events:events.description_placeholder]]">{event.description}</textarea>
								<p class="form-text text-muted small mt-2">[[cop-events:events.markdown_supported]]</p>
							</div>

							<!-- Submit -->
							<div class="col-12 text-end mt-4">
								<button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
									{{{ if isNew }}}
									<i class="fa fa-plus me-2"></i> [[cop-events:events.create]]
									{{{ else }}}
									<i class="fa fa-save me-2"></i> [[cop-events:events.save]]
									{{{ end }}}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
