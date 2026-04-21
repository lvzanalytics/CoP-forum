'use strict';

const db = require.main.require('./src/database');

const provider = require('./provider');
const cache = require('./cache');
const rateLimit = require('./rate-limit');
const prompts = require('./prompts');
const textExtractor = require('./text-extractor');

const documentSummary = module.exports;

const MAX_CHARS_SINGLE_PASS = 12000;
const CHUNK_SIZE = 10000;

function chunkText(text) {
	const chunks = [];
	for (let i = 0; i < text.length; i += CHUNK_SIZE) {
		chunks.push(text.slice(i, i + CHUNK_SIZE));
	}
	return chunks;
}

documentSummary.summarize = async function (docId, uid, settings) {
	// Check cache first
	const cached = await cache.getDocumentSummary(docId);
	if (cached.summary) {
		return cached.summary;
	}

	// Check rate limit (only for manual triggers)
	if (uid) {
		const allowed = await rateLimit.check(uid, 'document', settings);
		if (!allowed) {
			throw new Error('[[cop-ai:error.rate_limit]]');
		}
	}

	// Get document metadata
	const doc = await db.getObject(`document:${docId}`);
	if (!doc) {
		throw new Error('[[cop-ai:error.document_not_found]]');
	}

	const metadata = [
		`Titre : ${doc.title}`,
		`Auteur : ${doc.author}`,
		doc.description ? `Description : ${doc.description}` : '',
		doc.category ? `Catégorie : ${doc.category}` : '',
		doc.tags ? `Tags : ${doc.tags}` : '',
		doc.region ? `Région : ${doc.region}` : '',
		doc.sector ? `Secteur : ${doc.sector}` : '',
		doc.sourceOrg ? `Organisation : ${doc.sourceOrg}` : '',
	].filter(Boolean).join('\n');

	// Try to extract actual document text
	const extractedText = await textExtractor.extract(doc.fileUrl, doc.fileExt);

	let resultText;
	if (extractedText) {
		resultText = await summarizeWithContent(metadata, extractedText, settings);
	} else {
		// Fallback to metadata-only with a note about the limitation
		const result = await provider.generate(
			prompts.DOCUMENT_SUMMARY_SYSTEM,
			`Résumez le document suivant à partir de ses métadonnées uniquement (le contenu du fichier n'a pas pu être extrait) :\n\n${metadata}`,
			settings
		);
		if (result.usage) {
			await rateLimit.trackUsage('document', result.usage.totalTokens || 0);
		}
		resultText = result.text;
	}

	// Cache the result
	await cache.setDocumentSummary(docId, resultText);

	if (uid) {
		await rateLimit.increment(uid, 'document');
	}

	return resultText;
};

async function summarizeWithContent(metadata, text, settings) {
	const fullInput = `Métadonnées :\n${metadata}\n\nContenu du document :\n${text}`;

	if (text.length <= MAX_CHARS_SINGLE_PASS) {
		const result = await provider.generate(
			prompts.DOCUMENT_SUMMARY_SYSTEM,
			`Résumez le document suivant :\n\n${fullInput}`,
			settings
		);
		if (result.usage) {
			await rateLimit.trackUsage('document', result.usage.totalTokens || 0);
		}
		return result.text;
	}

	// Multi-pass: chunk the text, summarize each, then combine
	const chunks = chunkText(text);
	const chunkSummaries = [];

	for (const chunk of chunks) {
		const result = await provider.generate(
			prompts.DOCUMENT_CHUNK_SYSTEM,
			`Résumez cet extrait de document :\n\nMétadonnées :\n${metadata}\n\nExtrait :\n${chunk}`,
			settings
		);
		if (result.text) {
			chunkSummaries.push(result.text);
		}
		if (result.usage) {
			await rateLimit.trackUsage('document', result.usage.totalTokens || 0);
		}
	}

	// Final synthesis
	const combined = chunkSummaries.join('\n\n');
	const finalResult = await provider.generate(
		prompts.DOCUMENT_FINAL_SYSTEM,
		`Voici les résumés partiels d'un document :\n\nMétadonnées :\n${metadata}\n\nRésumés :\n${combined}\n\nProduisez la synthèse finale.`,
		settings
	);
	if (finalResult.usage) {
		await rateLimit.trackUsage('document', finalResult.usage.totalTokens || 0);
	}
	return finalResult.text;
}
