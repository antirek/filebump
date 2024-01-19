const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const config = require('config');
const axios = require('axios');
const checkAuthHeader = require('check-auth-header');
const {performance} = require('node:perf_hooks');

const {getId} = require('../getId');

const authHeader = config.authHeader || 'X-API-Key';
const authFn = (key) => {
  if (!key) return false;
  return config.keys.includes(key);
};

const router = express.Router();
router.use(express.json());
router.use(checkAuthHeader({
  authFn,
  authHeader,
  excludes: [],
  status401onFail: true,
}));

let requestCounter = 0;
let requestFailCounter = 0;

router.post('/', async (req, res) => {
  const startTime = performance.now();
  requestCounter++;
  const log = (...args) => {
    console.log(`[download:${requestCounter}]`, ...args);
  };
  try {
    const downloadUrl = req.body.url;
    const fileId = getId();

    const key = req.get(authHeader);
    log('>>> request', {key, fileId, downloadUrl});
    const resData = {
      fileId,
      url: `${config.baseUrl}/file/${fileId}`,
      status: 'DOWNLOAD',
    };
    log('<<< response:', resData);
    res.json(resData);

    const response = await axios.get(downloadUrl, {responseType: 'arraybuffer'});

    const metadata = {
      fileId,
      downloadUrl,
      mimetype: response.headers['content-type'],
      size: response.headers['content-length'],
      dateCreated: (+new Date()/1000).toFixed(0),
      key,
    };
    log({metadata});

    const subDirId = fileId.substring(0, 4);
    const subDirPath = path.join(config.uploadDir, subDirId);
    await fs.mkdir(subDirPath, {recursive: true});

    const uploadPathFile = path.join(subDirPath, fileId);
    const uploadPathMetadata = path.join(subDirPath, fileId + '.json');

    await fs.writeFile(uploadPathFile, response.data, {encoding: 'binary'});
    await fs.writeFile(uploadPathMetadata, JSON.stringify(metadata, null, 2));

    log('file download success', fileId);
  } catch (err) {
    requestFailCounter++;
    log('download, failCounter:', requestFailCounter);
    log('download, catch err', err);
  }

  const duration = Number((performance.now() - startTime)/1000).toFixed(2);
  log('performance:', duration);
});

module.exports = router;
