'use strict';

const { generateText } = require('ai');

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
		return generateWithAgentSDK(systemPrompt, userPrompt, settings);
	}

	const model = getModel(settings);
	const { text, usage } = await generateText({
		model,
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.3,
	});
	return { text, usage };
};
