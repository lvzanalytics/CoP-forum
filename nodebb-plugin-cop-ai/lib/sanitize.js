'use strict';

const sanitize = module.exports;

/**
 * Replace usernames with anonymous participant labels and strip emails.
 * Returns { text, userMap } where userMap is { username: 'Participant N' }
 */
sanitize.stripPII = function (posts) {
	const userMap = {};
	let counter = 1;

	const sanitized = posts.map((post) => {
		if (!userMap[post.username]) {
			userMap[post.username] = `Participant ${counter}`;
			counter++;
		}
		let content = post.content || '';
		// Remove email addresses
		content = content.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]');
		return {
			...post,
			username: userMap[post.username],
			content,
		};
	});

	return { posts: sanitized, userMap };
};
