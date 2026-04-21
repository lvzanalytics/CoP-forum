'use strict';

const textExtractor = module.exports;

const FETCH_TIMEOUT_MS = 30000;
const MAX_TEXT_CHARS = 600000; // ~150k tokens — hard cap for very large docs

textExtractor.extract = async function (fileUrl, fileExt) {
	if (!fileUrl) {
		return null;
	}

	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

		const response = await fetch(fileUrl, { signal: controller.signal });
		clearTimeout(timer);

		if (!response.ok) {
			return null;
		}
		const buffer = Buffer.from(await response.arrayBuffer());
		const ext = (fileExt || '').toLowerCase().replace(/^\./, '');

		let text = null;

		if (ext === 'pdf') {
			const pdfParse = require('pdf-parse');
			const data = await pdfParse(buffer);
			text = data.text || null;
		} else if (ext === 'docx') {
			const mammoth = require('mammoth');
			const result = await mammoth.extractRawText({ buffer });
			text = result.value || null;
		}

		if (text && text.length > MAX_TEXT_CHARS) {
			console.log(`[cop-ai] Text truncated from ${text.length} to ${MAX_TEXT_CHARS} chars`);
			text = text.slice(0, MAX_TEXT_CHARS) +
				'\n\n[… Document tronqué — seules les premières sections ont été analysées.]';
		}

		return text;
	} catch (err) {
		if (err.name === 'AbortError') {
			console.error('[cop-ai] Text extraction timed out after ' + (FETCH_TIMEOUT_MS / 1000) + 's');
		} else {
			console.error('[cop-ai] Text extraction failed:', err.message);
		}
		return null;
	}
};
