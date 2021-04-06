const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('config');
const axios = require('axios');

const {getId} = require('../getId');

const router = express.Router();
router.use(express.json());

router.post('/', async (req, res) => {
  try {
    const downloadUrl = req.body.url;
    const fileId = getId();

    res.json({
      fileId,
      url: `${config.baseUrl}/file/${fileId}`,
      status: 'DOWNLOAD',
    });

    const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    
    const metadata = {
      fileId,
      downloadUrl,
      mimetype: response.headers['content-type'],
      size: response.headers['content-length'],
      dateCreated: (+new Date()/1000).toFixed(0),
    };

    const subDirId = fileId.substring(0, 4);
    const subDirPath = path.join(config.uploadDir, subDirId);
    fs.mkdirSync(subDirPath, { recursive: true });
  
    const uploadPathFile = path.join(subDirPath, fileId);
    const uploadPathMetadata = path.join(subDirPath, fileId + '.json');

    fs.writeFileSync(uploadPathFile, response.data, {
      encoding: 'binary',
    });
    fs.writeFileSync(uploadPathMetadata, JSON.stringify(metadata, null, 2));

    console.log('file download success', fileId);
  } catch (err) {
    console.log(err);
    res.status(500).send('');
  }
});

module.exports = router;