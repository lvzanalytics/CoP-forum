'use strict';

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const file = require.main.require('./src/file');
const db = require.main.require('./src/database');

const storage = module.exports;

const S3_PLUGIN_DB_KEY = '@nodebb/nodebb-plugin-s3-uploads';

async function getS3Settings() {
	const settings = await db.getObjectFields(S3_PLUGIN_DB_KEY, [
		'accessKeyId', 'secretAccessKey', 'bucket', 'endpoint', 'host',
	]);
	return {
		accessKeyId: settings.accessKeyId || process.env.S3_UPLOADS_ACCESS_KEY_ID || '',
		secretAccessKey: settings.secretAccessKey || process.env.S3_UPLOADS_SECRET_ACCESS_KEY || '',
		bucket: settings.bucket || process.env.S3_UPLOADS_BUCKET || '',
		endpoint: settings.endpoint || process.env.S3_UPLOADS_ENDPOINT || '',
		host: (settings.host || process.env.S3_UPLOADS_HOST || '').replace(/\/+$/, ''),
	};
}

function isS3Configured(s3) {
	return !!(s3.accessKeyId && s3.secretAccessKey && s3.bucket && s3.endpoint);
}

function getS3Client(s3) {
	return new S3Client({
		region: 'auto',
		endpoint: s3.endpoint.startsWith('http') ? s3.endpoint : `https://${s3.endpoint}`,
		credentials: {
			accessKeyId: s3.accessKeyId,
			secretAccessKey: s3.secretAccessKey,
		},
		requestChecksumCalculation: 'WHEN_REQUIRED',
	});
}

storage.save = async function (fileObj) {
	const s3 = await getS3Settings();

	if (isS3Configured(s3)) {
		return saveToS3(fileObj, s3);
	}
	return saveToLocal(fileObj);
};

async function saveToS3(fileObj, s3) {
	const client = getS3Client(s3);
	const key = `cop-documents/${fileObj.name}`;
	const fileBuffer = await fs.promises.readFile(fileObj.path);
	const mime = require('mime');
	const contentType = mime.getType(fileObj.name) || 'application/octet-stream';

	await client.send(new PutObjectCommand({
		Bucket: s3.bucket,
		Key: key,
		Body: fileBuffer,
		ContentType: contentType,
	}));

	let host = s3.host || `https://${s3.bucket}.s3.amazonaws.com`;
	if (!host.startsWith('http')) {
		host = `https://${host}`;
	}

	return {
		url: `${host}/${key}`,
		path: key,
	};
}

async function saveToLocal(fileObj) {
	return file.saveFileToLocal(fileObj.name, 'cop-documents', fileObj.path);
}
