'use strict';

const User = require.main.require('./src/user');

const moderation = module.exports;

moderation.canModerate = async function (uid) {
	if (!uid || parseInt(uid, 10) <= 0) {
		return false;
	}
	return await User.isAdminOrGlobalMod(uid);
};

moderation.isAdmin = async function (uid) {
	if (!uid || parseInt(uid, 10) <= 0) {
		return false;
	}
	return await User.isAdministrator(uid);
};
