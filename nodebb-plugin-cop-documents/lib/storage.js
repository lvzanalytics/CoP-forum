'use strict';

const file = require.main.require('./src/file');

const storage = module.exports;

storage.save = async function (fileObj) {
	// fileObj has: name (desired filename), path (temp path from multer)
	// Always use local storage for now; R2 support can be added later
	const result = await file.saveFileToLocal(fileObj.name, 'cop-documents', fileObj.path);
	return result; // { url, path }
};
