'use strict';

const textExtractor = module.exports;

textExtractor.extract = async function (fileUrl, fileExt) {
	if (!fileUrl) {
		return null;
	}

	try {
		const response = await fetch(fileUrl);
		if (!response.ok) {
			return null;
		}
		const buffer = Buffer.from(await response.arrayBuffer());
		const ext = (fileExt || '').toLowerCase().replace(/^\./, '');

		if (ext === 'pdf') {
			const pdfParse = require('pdf-parse');
			const data = await pdfParse(buffer);
			return data.text || null;
		}

		if (ext === 'docx') {
			const mammoth = require('mammoth');
			const result = await mammoth.extractRawText({ buffer });
			return result.value || null;
		}

		return null;
	} catch (err) {
		console.error('[cop-ai] Text extraction failed:', err.message);
		return null;
	}
};
