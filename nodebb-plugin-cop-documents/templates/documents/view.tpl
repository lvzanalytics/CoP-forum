<div class="documents-view">
	<div class="container">
		<div class="row">
			<div class="col-lg-8">
				<h2 class="fw-semibold tracking-tight mb-2">{document.title}</h2>

				<!-- Status badge for non-approved -->
				{{{ if (document.status == "pending") }}}
				<span class="badge bg-warning doc-pending-badge mb-3">[[cop-documents:view.status_pending]]</span>
				{{{ end }}}
				{{{ if (document.status == "rejected") }}}
				<span class="badge bg-danger mb-3">[[cop-documents:view.status_rejected]]</span>
				{{{ end }}}

				<!-- Description -->
				<div class="card mb-4">
					<div class="card-body">
						<p>{document.description}</p>
					</div>
				</div>

				<!-- Download -->
				<div class="mb-4">
					<a href="#" class="btn btn-success btn-lg doc-download-btn" data-doc-id="{document.docId}" data-file-url="{document.fileUrl}">
						<i class="fa fa-download"></i> [[cop-documents:view.download]]
					</a>
					<span class="text-muted ms-2">{document.downloads} [[cop-documents:view.download_count]]</span>
				</div>

				<!-- Version History -->
				{{{ if versions.length }}}
				<div class="card mb-4">
					<div class="card-header">
						<h5 class="mb-0">[[cop-documents:view.versions]]</h5>
					</div>
					<div class="table-responsive">
						<table class="table table-striped mb-0">
							<thead>
								<tr>
									<th>[[cop-documents:view.version]]</th>
									<th>[[cop-documents:view.uploaded_by]]</th>
									<th>[[cop-documents:view.note]]</th>
									<th>[[cop-documents:view.date]]</th>
								</tr>
							</thead>
							<tbody>
								{{{each versions}}}
								<tr>
									<td>v{./version}</td>
									<td>{{{ if ./user }}}{./user.username}{{{ end }}}</td>
									<td>{./note}</td>
									<td>{./createdAt}</td>
								</tr>
								{{{end}}}
							</tbody>
						</table>
					</div>
				</div>
				{{{ end }}}

				<!-- Upload New Version (if logged in) -->
				{{{ if loggedIn }}}
				<div class="card mb-4">
					<div class="card-header">
						<h5 class="mb-0">[[cop-documents:view.new_version]]</h5>
					</div>
					<div class="card-body">
						<form id="version-upload-form" data-doc-id="{document.docId}">
							<div class="mb-3">
								<label class="form-label" for="version-file">[[cop-documents:upload.file]]</label>
								<input type="file" class="form-control" id="version-file" name="file" required>
							</div>
							<div class="mb-3">
								<label class="form-label" for="version-note">[[cop-documents:view.new_version_note]]</label>
								<input type="text" class="form-control" id="version-note" name="note" required>
							</div>
							<button type="submit" class="btn btn-primary btn-sm">
								<i class="fa fa-upload"></i> [[cop-documents:upload.submit]]
							</button>
						</form>
					</div>
				</div>
				{{{ end }}}

				<!-- Moderation Actions -->
				{{{ if canModerate }}}
				<div class="card mb-4 border-warning">
					<div class="card-header bg-warning bg-opacity-25">
						<h5 class="mb-0">Actions</h5>
					</div>
					<div class="card-body">
						{{{ if (document.status == "pending") }}}
						<button class="btn btn-success me-2 doc-approve-btn" data-doc-id="{document.docId}">
							<i class="fa fa-check"></i> [[cop-documents:moderation.approve]]
						</button>
						<button class="btn btn-warning me-2 doc-reject-btn" data-doc-id="{document.docId}">
							<i class="fa fa-times"></i> [[cop-documents:moderation.reject]]
						</button>
						{{{ end }}}
						<button class="btn btn-danger doc-delete-btn" data-doc-id="{document.docId}">
							<i class="fa fa-trash"></i> [[cop-documents:moderation.delete]]
						</button>
					</div>
				</div>
				{{{ end }}}
			</div>

			<!-- Sidebar: Metadata -->
			<div class="col-lg-4">
				<div class="card">
					<div class="card-header">
						<h5 class="mb-0">[[cop-documents:view.metadata]]</h5>
					</div>
					<div class="card-body">
						<table class="table table-sm table-borderless mb-0">
							<tr>
								<th>[[cop-documents:view.author]]</th>
								<td>{document.author}</td>
							</tr>
							<tr>
								<th>[[cop-documents:view.date]]</th>
								<td>{document.date}</td>
							</tr>
							<tr>
								<th>[[cop-documents:view.category]]</th>
								<td>{document.categoryLabel}</td>
							</tr>
							<tr>
								<th>[[cop-documents:view.tags]]</th>
								<td>
									{{{ each document.tagsArray }}}
									<span class="badge bg-info text-dark">{@value}</span>
									{{{ end }}}
								</td>
							</tr>
							{{{ if document.region }}}
							<tr>
								<th>[[cop-documents:view.region]]</th>
								<td>{document.region}</td>
							</tr>
							{{{ end }}}
							{{{ if document.sector }}}
							<tr>
								<th>[[cop-documents:view.sector]]</th>
								<td>{document.sector}</td>
							</tr>
							{{{ end }}}
							{{{ if document.sourceOrg }}}
							<tr>
								<th>[[cop-documents:view.source_org]]</th>
								<td>{document.sourceOrg}</td>
							</tr>
							{{{ end }}}
							{{{ if document.pubDate }}}
							<tr>
								<th>[[cop-documents:view.pub_date]]</th>
								<td>{document.pubDate}</td>
							</tr>
							{{{ end }}}
							<tr>
								<th>[[cop-documents:view.language]]</th>
								<td>{document.language}</td>
							</tr>
							<tr>
								<th>[[cop-documents:view.access]]</th>
								<td>{document.accessLabel}</td>
							</tr>
							<tr>
								<th>[[cop-documents:view.status]]</th>
								<td>
									{{{ if (document.status == "approved") }}}
									<span class="badge bg-success">[[cop-documents:view.status_approved]]</span>
									{{{ end }}}
									{{{ if (document.status == "pending") }}}
									<span class="badge bg-warning">[[cop-documents:view.status_pending]]</span>
									{{{ end }}}
									{{{ if (document.status == "rejected") }}}
									<span class="badge bg-danger">[[cop-documents:view.status_rejected]]</span>
									{{{ end }}}
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
