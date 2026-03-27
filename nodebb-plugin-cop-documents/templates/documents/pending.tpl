<div class="documents-pending">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="fw-semibold tracking-tight mb-4">[[cop-documents:moderation.title]]</h2>

				{{{ if !documents.length }}}
				<div class="alert alert-info">[[cop-documents:moderation.no_pending]]</div>
				{{{ end }}}

				{{{ if documents.length }}}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead>
							<tr>
								<th>[[cop-documents:upload.doc_title]]</th>
								<th>[[cop-documents:view.uploaded_by]]</th>
								<th>[[cop-documents:view.date]]</th>
								<th>[[cop-documents:view.category]]</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{{{each documents}}}
							<tr>
								<td>
									<a href="{config.relative_path}/documents/{./docId}/{./slug}">{./title}</a>
								</td>
								<td>{{{ if ./user }}}{./user.username}{{{ end }}}</td>
								<td>{./date}</td>
								<td>{./categoryLabel}</td>
								<td>
									<button class="btn btn-success btn-sm doc-approve-btn me-1" data-doc-id="{./docId}">
										<i class="fa fa-check"></i> [[cop-documents:moderation.approve]]
									</button>
									<button class="btn btn-warning btn-sm doc-reject-btn me-1" data-doc-id="{./docId}">
										<i class="fa fa-times"></i> [[cop-documents:moderation.reject]]
									</button>
									<button class="btn btn-danger btn-sm doc-delete-btn" data-doc-id="{./docId}">
										<i class="fa fa-trash"></i> [[cop-documents:moderation.delete]]
									</button>
								</td>
							</tr>
							{{{end}}}
						</tbody>
					</table>
				</div>
				{{{ end }}}
			</div>
		</div>
	</div>
</div>
