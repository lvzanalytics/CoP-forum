'use strict';

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const file = require.main.require('./src/file');
const meta = require.main.require('./src/meta');

const storage = module.exports;

function getR2Settings(settings) {
	return {
		accountId: settings.r2AccountId || '',
		accessKeyId: settings.r2AccessKeyId || '',
		secretAccessKey: settings.r2SecretAccessKey || '',
		bucket: settings.r2Bucket || '',
		publicUrl: (settings.r2PublicUrl || '').replace(/\/+$/, ''),
	};
}

function isR2Configured(r2) {
	return !!(r2.accountId && r2.accessKeyId && r2.secretAccessKey && r2.bucket && r2.publicUrl);
}

function getS3Client(r2) {
	return new S3Client({
		region: 'auto',
		endpoint: `https://${r2.accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: r2.accessKeyId,
			secretAccessKey: r2.secretAccessKey,
		},
		requestChecksumCalculation: 'WHEN_REQUIRED',
	});
}

storage.save = async function (fileObj) {
	const settings = await meta.settings.get('cop-documents');
	const r2 = getR2Settings(settings);

	if (isR2Configured(r2)) {
		return saveToR2(fileObj, r2);
	}
	return saveToLocal(fileObj);
};

async function saveToR2(fileObj, r2) {
	const client = getS3Client(r2);
	const key = `cop-documents/${fileObj.name}`;
	const fileBuffer = await fs.promises.readFile(fileObj.path);
	const mime = require('mime');
	const contentType = mime.getType(fileObj.name) || 'application/octet-stream';

	await client.send(new PutObjectCommand({
		Bucket: r2.bucket,
		Key: key,
		Body: fileBuffer,
		ContentType: contentType,
	}));

	return {
		url: `${r2.publicUrl}/${key}`,
		path: key,
	};
}

async function saveToLocal(fileObj) {
	return file.saveFileToLocal(fileObj.name, 'cop-documents', fileObj.path);
}
