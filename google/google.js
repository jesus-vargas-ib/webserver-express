// Google Cloud Storage
const { Storage } = require('@google-cloud/storage');
const projectId = 'bco-codes';
const CLOUD_BUCKET = 'ejemplo-node';

const fs = require('fs');
const path = require('path');
const gTokenPath = path.join(`${__dirname}/gToken.json`);
fs.writeFileSync(gTokenPath, process.env.GCS_JSON_TOKEN);
const gcsKeyFile = JSON.parse(process.env.GCS_JSON_TOKEN);

const storage = new Storage({
    projectId: projectId,
    keyFilename: gTokenPath,
});
const bucket = storage.bucket(CLOUD_BUCKET);

const getBucket = () => {
    return bucket;
}

const getPublicUrl = (filename) => {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

module.exports = {
    getBucket,
    CLOUD_BUCKET,
    getPublicUrl
}