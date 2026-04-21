'use strict';

const sanitize = module.exports;

/**
 * Strip email addresses from post content but preserve usernames.
 * The first poster (topic author) keeps their username prominently.
 * Returns { posts }
 */
sanitize.cleanContent = function (posts) {
	const sanitized = posts.map((post, index) => {
		let content = post.content || '';
		// Remove email addresses
		content = content.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]');
		// Strip HTML tags (posts may contain rendered HTML)
		content = content.replace(/<[^>]+>/g, '');
		// Collapse excessive whitespace
		content = content.replace(/\n{3,}/g, '\n\n').trim();
		return {
			...post,
			content,
			isAuthor: index === 0,
		};
	});

	return { posts: sanitized };
};
