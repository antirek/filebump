const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('config');

const router = express.Router();

router.get('/:fileId', async(req, res) => {
  const {fileId} = req.params;
  console.log('f', fileId);

  const subDirId = fileId.substring(0, 4);
  const subDirPath = path.join(config.uploadDir, subDirId);

  const uploadPathFile = path.join(subDirPath, fileId);
  const uploadPathMetadata = path.join(subDirPath, fileId + '.json');

  const metadata = JSON.parse(fs.readFileSync(uploadPathMetadata));
  console.log('m', metadata);

  res.sendFile(uploadPathFile, {
    headers: {
      'Content-Type': metadata.mimetype,
    },
  });
});

module.exports = router;