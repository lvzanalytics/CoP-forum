'use strict';

const { generateText } = require('ai');

const AI_TIMEOUT_MS = 120000; // 2 minutes per call

function getModel(settings) {
	switch (settings.provider) {
		case 'anthropic': {
			const { createAnthropic } = require('@ai-sdk/anthropic');
			return createAnthropic({ apiKey: settings.apiKey })(settings.model);
		}
		case 'google': {
			const { createGoogleGenerativeAI } = require('@ai-sdk/google');
			return createGoogleGenerativeAI({ apiKey: settings.apiKey })(settings.model);
		}
		default: {
			const { createOpenAI } = require('@ai-sdk/openai');
			return createOpenAI({
				apiKey: settings.apiKey,
				baseURL: settings.apiBaseUrl || undefined,
			})(settings.model);
		}
	}
}

function withTimeout(promise, ms) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('AI request timed out')), ms);
		promise.then(
			(val) => { clearTimeout(timer); resolve(val); },
			(err) => { clearTimeout(timer); reject(err); }
		);
	});
}

async function generateWithAgentSDK(systemPrompt, userPrompt, settings) {
	const { query } = require('@anthropic-ai/claude-agent-sdk');
	const env = { ...process.env };

	if (settings.loginMethod === 'claudeai') {
		delete env.ANTHROPIC_API_KEY;
		delete env.CLAUDE_CODE_SIMPLE;
	} else {
		env.ANTHROPIC_API_KEY = settings.apiKey;
		env.CLAUDE_CODE_SIMPLE = '1';
	}

	let resultText = '';
	for await (const event of query({
		prompt: `${systemPrompt}\n\n${userPrompt}`,
		options: {
			env,
			model: settings.model || 'claude-sonnet-4-6',
			maxTurns: 1,
			systemPrompt,
			permissionMode: 'bypassPermissions',
			allowDangerouslySkipPermissions: true,
			persistSession: false,
			...(settings.loginMethod === 'claudeai'
				? { forceLoginMethod: 'claudeai' }
				: {}),
		},
	})) {
		if (event.type === 'result') {
			if (event.subtype === 'success') {
				resultText = event.result || '';
			} else {
				throw new Error(event.errors?.join('\n') || 'Agent SDK error');
			}
		}
	}
	return { text: resultText, usage: null };
}

exports.generate = async function (systemPrompt, userPrompt, settings) {
	if (settings.provider === 'agent-sdk') {
		return withTimeout(
			generateWithAgentSDK(systemPrompt, userPrompt, settings),
			AI_TIMEOUT_MS
		);
	}

	const model = getModel(settings);
	const result = await withTimeout(
		generateText({
			model,
			system: systemPrompt,
			prompt: userPrompt,
			temperature: 0.3,
		}),
		AI_TIMEOUT_MS
	);
	return { text: result.text, usage: result.usage };
};
