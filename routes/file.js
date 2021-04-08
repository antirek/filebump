const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('config');

const router = express.Router();

const processFileGet = async(req, res) => {
  try {
    const {fileId, filename} = req.params;
    console.log('GET', JSON.stringify({fileId, filename}));

    const subDirId = fileId.substring(0, 4);
    const subDirPath = path.join(config.uploadDir, subDirId);

    const uploadPathFile = path.join(subDirPath, fileId);
    const uploadPathMetadata = path.join(subDirPath, fileId + '.json');
    
    if (!fs.existsSync(uploadPathFile)) {
      res.status(404).json({status: 'NOT FOUND'});
      console.log('not found file', fileId);
      return;
    }

    const metadata = JSON.parse(fs.readFileSync(uploadPathMetadata));
    console.log('m', metadata);

    res.sendFile(uploadPathFile, {
      headers: {
        'Content-Type': metadata.mimetype,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}

router.get('/:fileId', processFileGet);
router.get('/:fileId/:filename', processFileGet);

module.exports = router;