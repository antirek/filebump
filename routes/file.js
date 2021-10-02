const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const config = require('config');

const router = express.Router();

const processFileGet = async(req, res) => {
  try {
    let isRequiredMp3 = false;    
    const {fileId, filename} = req.params;
    console.log('GET', JSON.stringify({fileId, filename}));

    const subDirId = fileId.substring(0, 4);
    const subDirPath = path.join(config.uploadDir, subDirId);

    let uploadPathFile = path.join(subDirPath, fileId);

    if (filename && path.extname(filename) === '.mp3') {
      uploadPathFile = uploadPathFile + '.mp3';
      console.log('required mp3 file', uploadPathFile);
      isRequiredMp3 = true;
    }
    
    const uploadPathMetadata = path.join(subDirPath, fileId + '.json');
    
    try {
      await fs.access(uploadPathFile);
    } catch (e) {
      res.status(404).json({status: 'NOT FOUND'});
      console.log('not found file', fileId);
      return;
    }
    
    const metadataFileData = await fs.readFile(uploadPathMetadata);
    const metadata = JSON.parse(metadataFileData);
    console.log('metadata', metadata);

    res.sendFile(uploadPathFile, {
      headers: {
        'Content-Type': isRequiredMp3 ? 'audio/mpeg' : metadata.mimetype,
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