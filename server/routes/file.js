const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const config = require('config');

const router = express.Router();

let requestCounter = 0;
// let requestFailCounter = 0;

const processFileGet = async (req, res) => {
  requestCounter++;
  const log = (...args) => {
    console.log(`[file:${requestCounter}]`, ...args);
  };
  try {
    let isRequiredMp3 = false;
    const {fileId, filename} = req.params;
    log('>>> get file', JSON.stringify({fileId, filename}));

    const subDirId = fileId.substring(0, 4);
    const subDirPath = path.join(config.uploadDir, subDirId);

    let uploadPathFile = path.join(subDirPath, fileId);

    if (filename && path.extname(filename) === '.mp3') {
      uploadPathFile = uploadPathFile + '.mp3';
      log('required mp3 file', uploadPathFile);
      isRequiredMp3 = true;
    }

    const uploadPathMetadata = path.join(subDirPath, fileId + '.json');

    try {
      await fs.access(uploadPathFile);
    } catch (e) {
      res.status(404).json({status: 'NOT FOUND'});
      log('not found file', fileId);
      return;
    }

    const metadataFileData = await fs.readFile(uploadPathMetadata);
    const metadata = JSON.parse(metadataFileData);
    log('metadata', metadata);

    res.sendFile(uploadPathFile, {
      headers: {
        'Content-Type': isRequiredMp3 ? 'audio/mpeg' : metadata.mimetype,
      },
    });
  } catch (err) {
    log(err);
    res.status(500).send();
  }
};

router.get('/:fileId', processFileGet);
router.get('/:fileId/:filename', processFileGet);

module.exports = router;
