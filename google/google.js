// Google Cloud Storage
process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + '/config/bco-codes-869c8359ed95.json';
const { Storage } = require('@google-cloud/storage');
const projectId = 'bco-codes';
const CLOUD_BUCKET = 'ejemplo-node';
const storage = new Storage({
    projectId: projectId,
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