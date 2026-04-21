'use strict';

// Format cached digest markdown → HTML on categories page (same pattern as discussion/document summaries)
$(window).on('action:ajaxify.end', function () {
	var el = $('[component="copai/digest-content"][data-raw-digest]');
	if (el.length) {
		var raw = el.attr('data-raw-digest');
		if (raw) {
			el.html(formatSummary(raw));
		}
	}
});

$(document).on('click', '[component="copai/summarize-btn"]', function () {
	const tid = $(this).attr('data-tid');
	if (!tid) return;

	const btn = $(this);
	const section = btn.closest('.cop-ai-summary-section');
	const summaryContainer = section.find('[component="copai/summary"]');
	const loadingEl = section.find('[component="copai/summary-loading"]');

	btn.prop('disabled', true);
	loadingEl.removeClass('d-none');

	socket.emit('plugins.copai.summarizeTopic', { tid }, function (err, data) {
		loadingEl.addClass('d-none');
		btn.prop('disabled', false);

		if (err) {
			require(['alerts'], function (alerts) {
				alerts.error(err.message);
			});
			return;
		}
		if (data) {
			const formatted = formatSummary(data);
			const truncated = truncateHtml(data, 280);

			if (summaryContainer.length) {
				summaryContainer.find('.cop-ai-summary-preview').html(truncated);
				summaryContainer.attr('data-full-summary', data);
				summaryContainer.removeClass('d-none');
				// Show "read more" only if text was truncated
				if (data.length > 280) {
					summaryContainer.find('.cop-ai-read-more').removeClass('d-none');
				}
			} else {
				// Build the container
				require(['translator'], function (translator) {
					translator.translate(
						'[[themes/cop:ai.summary_title]]|[[themes/cop:ai.read_more]]|[[themes/cop:ai.refresh]]',
						function (translated) {
							var parts = translated.split('|');
							var html =
								'<div component="copai/summary" class="mb-2" data-full-summary="' + escapeAttr(data) + '">' +
								'<div class="d-flex align-items-center gap-2 mb-2">' +
								'<i class="fa fa-robot text-muted"></i>' +
								'<span class="fw-semibold small text-muted">' + parts[0] + '</span>' +
								'</div>' +
								'<div class="cop-ai-summary-preview">' + truncated + '</div>' +
								(data.length > 280
									? '<button class="btn btn-sm btn-link p-0 mt-1 cop-ai-read-more">' + parts[1] + '</button>'
									: '') +
								'</div>';
							section.find('[component="copai/summarize-btn"]').closest('.d-flex').before(html);
							// Update button to refresh
							btn.find('i').nextAll().remove();
							btn.append(' ' + parts[2]);
						}
					);
				});
			}
		}
	});
});

// Read more — open full summary in modal
$(document).on('click', '.cop-ai-read-more', function () {
	var container = $(this).closest('[component="copai/summary"]');
	var fullText = container.attr('data-full-summary');
	if (!fullText) return;

	require(['bootbox', 'translator'], function (bootbox, translator) {
		translator.translate('[[themes/cop:ai.summary_title]]|[[global:close]]', function (translated) {
			var parts = translated.split('|');
			bootbox.dialog({
				title: '<i class="fa fa-robot me-2"></i>' + parts[0],
				message: '<div class="copai-modal-summary">' + formatSummary(fullText) + '</div>',
				size: 'large',
				buttons: {
					ok: {
						label: parts[1],
						className: 'btn-primary',
					},
				},
			});
		});
	});
});

// Catchup digest — generate button (admin only), same pattern as discussion summarize
$(document).on('click', '[component="copai/catchup-btn"]', function () {
	var btn = $(this);
	var widget = btn.closest('[component="copai/digest-widget"]');
	var loadingEl = widget.find('[component="copai/digest-loading"]');

	btn.prop('disabled', true);
	loadingEl.removeClass('d-none');

	$.get(config.relative_path + '/api/v3/plugins/cop-ai/catchup', function (res) {
		loadingEl.addClass('d-none');
		btn.prop('disabled', false);

		if (res && res.response && res.response.digest) {
			var digestHtml = formatSummary(res.response.digest);
			var contentEl = widget.find('[component="copai/digest-content"]');
			var emptyEl = widget.find('[component="copai/digest-empty"]');

			if (contentEl.length) {
				contentEl.html(digestHtml);
			} else if (emptyEl.length) {
				emptyEl.replaceWith(
					'<div class="cop-digest-content" component="copai/digest-content">' + digestHtml + '</div>'
				);
			}

			// Update button text to "refresh"
			require(['translator'], function (translator) {
				translator.translate('[[themes/cop:widget.digest_refresh]]', function (text) {
					btn.html('<i class="fa fa-arrows-rotate me-1"></i>' + text);
				});
			});
		}
	}).fail(function (xhr) {
		loadingEl.addClass('d-none');
		btn.prop('disabled', false);
		require(['alerts'], function (alerts) {
			var msg = (xhr.responseJSON && xhr.responseJSON.status) ? xhr.responseJSON.status.message : 'Error';
			alerts.error(msg);
		});
	});
});

function formatSummary(text) {
	var html = escapeHtml(text);
	var lines = html.split('\n');
	var result = [];
	var i = 0;

	while (i < lines.length) {
		var line = lines[i];

		// Blank line
		if (!line.trim()) { i++; continue; }

		// Headings
		var hMatch = line.match(/^(#{1,6})\s+(.+)$/);
		if (hMatch) {
			var level = Math.min(hMatch[1].length + 1, 6);
			result.push('<h' + level + '>' + inlineFormat(hMatch[2]) + '</h' + level + '>');
			i++; continue;
		}

		// Horizontal rule
		if (/^-{3,}$/.test(line.trim())) {
			result.push('<hr>');
			i++; continue;
		}

		// Unordered list block
		if (/^\s*[-•]\s/.test(line)) {
			var items = [];
			while (i < lines.length && /^\s*[-•]\s/.test(lines[i])) {
				items.push('<li>' + inlineFormat(lines[i].replace(/^\s*[-•]\s+/, '')) + '</li>');
				i++;
			}
			result.push('<ul>' + items.join('') + '</ul>');
			continue;
		}

		// Ordered list block
		if (/^\s*\d+[.)]\s/.test(line)) {
			var items = [];
			while (i < lines.length && /^\s*\d+[.)]\s/.test(lines[i])) {
				items.push('<li>' + inlineFormat(lines[i].replace(/^\s*\d+[.)]\s+/, '')) + '</li>');
				i++;
			}
			result.push('<ol>' + items.join('') + '</ol>');
			continue;
		}

		// Paragraph — collect consecutive non-blank, non-special lines
		var paraLines = [];
		while (i < lines.length && lines[i].trim() && !/^#{1,6}\s/.test(lines[i]) &&
			!/^\s*[-•]\s/.test(lines[i]) && !/^\s*\d+[.)]\s/.test(lines[i]) && !/^-{3,}$/.test(lines[i].trim())) {
			paraLines.push(lines[i]);
			i++;
		}
		result.push('<p>' + inlineFormat(paraLines.join('<br>')) + '</p>');
	}

	return result.join('');
}

function inlineFormat(text) {
	return text
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function stripMarkdown(text) {
	return text
		.replace(/\*\*(.+?)\*\*/g, '$1')
		.replace(/\*(.+?)\*/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^[-•]\s+/gm, '')
		.replace(/^\d+[.)]\s+/gm, '')
		.replace(/^-{3,}$/gm, '')
		.replace(/\n{2,}/g, ' ')
		.replace(/\n/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

function truncateHtml(text, maxLen) {
	var plain = stripMarkdown(text);
	if (plain.length <= maxLen) {
		return escapeHtml(plain);
	}
	var truncated = plain.slice(0, maxLen);
	var lastSpace = truncated.lastIndexOf(' ');
	if (lastSpace > maxLen * 0.7) {
		truncated = truncated.slice(0, lastSpace);
	}
	return escapeHtml(truncated + '…');
}

function escapeHtml(text) {
	var div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

function escapeAttr(text) {
	return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
