<div class="acp-page-container">
	<div class="col-lg-9">
		<div class="d-flex border-bottom py-2 m-0 sticky-top acp-page-main-header align-items-center justify-content-between">
			<h5 class="fw-bold tracking-tight mb-0">[[cop-ai:admin.title]]</h5>
			<button id="save" class="btn btn-primary btn-sm fw-semibold">
				<i class="fa fa-save"></i> [[cop-ai:admin.save]]
			</button>
		</div>

		<form class="cop-ai-settings">
			<!-- Provider Tab -->
			<ul class="nav nav-tabs mt-3" role="tablist">
				<li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#tab-provider">[[cop-ai:admin.tab_provider]]</a></li>
				<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-documents">[[cop-ai:admin.tab_documents]]</a></li>
				<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-discussions">[[cop-ai:admin.tab_discussions]]</a></li>
				<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-digest">[[cop-ai:admin.tab_digest]]</a></li>
				<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-limits">[[cop-ai:admin.tab_limits]]</a></li>
				<li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-usage">[[cop-ai:admin.tab_usage]]</a></li>
			</ul>

			<div class="tab-content mt-3">
				<!-- Provider -->
				<div class="tab-pane fade show active" id="tab-provider">
					<div class="mb-3">
						<label class="form-label" for="provider">[[cop-ai:admin.provider]]</label>
						<select id="provider" name="provider" class="form-select">
							<option value="openai">OpenAI</option>
							<option value="anthropic">Anthropic</option>
							<option value="google">Google (Gemini)</option>
							<option value="agent-sdk">[[cop-ai:admin.provider_agent_sdk]]</option>
						</select>
					</div>
					<div class="mb-3" id="loginMethodGroup" style="display:none;">
						<label class="form-label" for="loginMethod">[[cop-ai:admin.login_method]]</label>
						<select id="loginMethod" name="loginMethod" class="form-select">
							<option value="claudeai">[[cop-ai:admin.login_method_claudeai]]</option>
							<option value="api-key">[[cop-ai:admin.login_method_apikey]]</option>
						</select>
						<div class="form-text" id="loginMethodHint">[[cop-ai:admin.login_method_hint]]</div>
					</div>
					<div class="mb-3" id="apiKeyGroup">
						<label class="form-label" for="apiKey">[[cop-ai:admin.api_key]]</label>
						<input type="password" id="apiKey" name="apiKey" class="form-control" />
						<div class="form-text">[[cop-ai:admin.api_key_help]]</div>
					</div>
					<div class="mb-3">
						<label class="form-label" for="model">[[cop-ai:admin.model]]</label>
						<input type="text" id="model" name="model" class="form-control" placeholder="gpt-4o-mini" />
						<div class="form-text">[[cop-ai:admin.model_help]]</div>
					</div>
					<div class="mb-3" id="apiBaseUrlGroup">
						<label class="form-label" for="apiBaseUrl">[[cop-ai:admin.api_base_url]]</label>
						<input type="text" id="apiBaseUrl" name="apiBaseUrl" class="form-control" placeholder="https://api.openai.com/v1" />
						<div class="form-text">[[cop-ai:admin.api_base_url_help]]</div>
					</div>
				</div>

				<!-- Documents -->
				<div class="tab-pane fade" id="tab-documents">
					<div class="mb-3">
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" id="enableDocSummary" name="enableDocSummary">
							<label class="form-check-label" for="enableDocSummary">[[cop-ai:admin.enable_doc_summary]]</label>
						</div>
						<div class="form-text">[[cop-ai:admin.enable_doc_summary_help]]</div>
					</div>
					<div class="mb-3">
						<label class="form-label" for="docSummaryAccess">[[cop-ai:admin.doc_summary_access]]</label>
						<select id="docSummaryAccess" name="docSummaryAccess" class="form-select">
							<option value="all">[[cop-ai:admin.access_all]]</option>
							<option value="members">[[cop-ai:admin.access_members]]</option>
							<option value="disabled">[[cop-ai:admin.access_disabled]]</option>
						</select>
					</div>
				</div>

				<!-- Discussions -->
				<div class="tab-pane fade" id="tab-discussions">
					<div class="mb-3">
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" id="enableDiscussionSummary" name="enableDiscussionSummary">
							<label class="form-check-label" for="enableDiscussionSummary">[[cop-ai:admin.enable_discussion_summary]]</label>
						</div>
						<div class="form-text">[[cop-ai:admin.enable_discussion_summary_help]]</div>
					</div>
					<div class="mb-3">
						<label class="form-label" for="discussionSummaryAccess">[[cop-ai:admin.discussion_summary_access]]</label>
						<select id="discussionSummaryAccess" name="discussionSummaryAccess" class="form-select">
							<option value="members">[[cop-ai:admin.access_members]]</option>
							<option value="disabled">[[cop-ai:admin.access_disabled]]</option>
						</select>
					</div>
					<div class="mb-3">
						<label class="form-label" for="minRepliesForSummary">[[cop-ai:admin.min_replies]]</label>
						<input type="number" id="minRepliesForSummary" name="minRepliesForSummary" class="form-control" min="1" placeholder="15" />
					</div>
					<div class="mb-3">
						<label class="form-label" for="cacheInvalidationReplies">[[cop-ai:admin.cache_invalidation_replies]]</label>
						<input type="number" id="cacheInvalidationReplies" name="cacheInvalidationReplies" class="form-control" min="1" placeholder="10" />
					</div>
					<div class="mb-3">
						<label class="form-label" for="discussionCacheHours">[[cop-ai:admin.discussion_cache_hours]]</label>
						<input type="number" id="discussionCacheHours" name="discussionCacheHours" class="form-control" min="1" placeholder="12" />
					</div>
				</div>

				<!-- Digest -->
				<div class="tab-pane fade" id="tab-digest">
					<div class="mb-3">
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" id="enableCatchupDigest" name="enableCatchupDigest">
							<label class="form-check-label" for="enableCatchupDigest">[[cop-ai:admin.enable_catchup_digest]]</label>
						</div>
					</div>
					<div class="mb-3">
						<label class="form-label" for="catchupDigestAccess">[[cop-ai:admin.catchup_digest_access]]</label>
						<select id="catchupDigestAccess" name="catchupDigestAccess" class="form-select">
							<option value="members">[[cop-ai:admin.access_members]]</option>
							<option value="disabled">[[cop-ai:admin.access_disabled]]</option>
						</select>
					</div>
					<div class="mb-3">
						<label class="form-label" for="catchupAbsenceDays">[[cop-ai:admin.absence_days]]</label>
						<input type="number" id="catchupAbsenceDays" name="catchupAbsenceDays" class="form-control" min="1" placeholder="14" />
					</div>
					<div class="mb-3">
						<label class="form-label" for="digestCacheHours">[[cop-ai:admin.digest_cache_hours]]</label>
						<input type="number" id="digestCacheHours" name="digestCacheHours" class="form-control" min="1" placeholder="6" />
					</div>
				</div>

				<!-- Limits -->
				<div class="tab-pane fade" id="tab-limits">
					<div class="mb-3">
						<label class="form-label" for="dailySummaryLimit">[[cop-ai:admin.daily_limit]]</label>
						<input type="number" id="dailySummaryLimit" name="dailySummaryLimit" class="form-control" min="1" placeholder="5" />
						<div class="form-text">[[cop-ai:admin.daily_limit_help]]</div>
					</div>
				</div>

				<!-- Usage -->
				<div class="tab-pane fade" id="tab-usage">
					<div id="copai-usage-stats" class="mt-2">
						<p class="text-muted">[[cop-ai:admin.usage_loading]]</p>
					</div>

					<hr>

					<h5 class="fw-bold mt-4">[[cop-ai:admin.cache_management]]</h5>
					<div class="table-responsive mt-3">
						<table class="table table-sm">
							<tbody>
								<tr>
									<td>[[cop-ai:admin.discussion_summaries]]</td>
									<td><span id="copai-count-discussions" class="badge bg-secondary">—</span></td>
									<td><button class="btn btn-sm btn-outline-danger copai-clear-btn" data-type="discussions">[[cop-ai:admin.clear]]</button></td>
								</tr>
								<tr>
									<td>[[cop-ai:admin.document_summaries]]</td>
									<td><span id="copai-count-documents" class="badge bg-secondary">—</span></td>
									<td><button class="btn btn-sm btn-outline-danger copai-clear-btn" data-type="documents">[[cop-ai:admin.clear]]</button></td>
								</tr>
								<tr>
									<td>[[cop-ai:admin.digest_caches]]</td>
									<td><span id="copai-count-digests" class="badge bg-secondary">—</span></td>
									<td><button class="btn btn-sm btn-outline-danger copai-clear-btn" data-type="digests">[[cop-ai:admin.clear]]</button></td>
								</tr>
								<tr>
									<td>[[cop-ai:admin.rate_limit_data]]</td>
									<td><span id="copai-count-ratelimits" class="badge bg-secondary">—</span></td>
									<td><button class="btn btn-sm btn-outline-danger copai-clear-btn" data-type="ratelimits">[[cop-ai:admin.clear]]</button></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
