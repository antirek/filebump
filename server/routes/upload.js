const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const checkAuthHeader = require('check-auth-header');
const config = require('config');
const express = require('express');
const fileUpload = require('express-fileupload');

const {getId} = require('../getId');

const prepareMetadata = (uploadedFile) => {
  return {
    name: uploadedFile.name,
    mimetype: uploadedFile.mimetype,
    md5: uploadedFile.md5,
    size: uploadedFile.size,
    dateCreated: (+new Date()/1000).toFixed(0),
  };
};

const postUploadAction = async (metadata) => {
  if (metadata.mimetype !== 'audio/ogg') {
    return console.log(`${metadata.mimetype}: post actions for uploaded mimetype is not defined`);
  }

  if (metadata.mimetype === 'audio/ogg') {
    console.log(`${metadata.mimetype}: start post upload action`);
    const fileId = metadata.fileId;

    const subDirId = fileId.substring(0, 4);
  
    const subDirPath = path.join(config.uploadDir, subDirId);
    await fs.mkdir(subDirPath, { recursive: true });
    
    const uploadPathFile = path.join(subDirPath, fileId);
    const { stdout, stderr } = await exec(`ffmpeg -i ${uploadPathFile} ${uploadPathFile}.mp3`);
    console.log(stdout, stderr);
  }
}

const authHeader = config.authHeader || 'X-API-Key';
const authFn = (key) => {
  if (!key) return false;
  return config.keys.includes(key);
}

const router = express.Router();
router.use(fileUpload());
router.use(checkAuthHeader({
  authFn,
  authHeader,
  excludes: [],
  status401onFail: true,
}));

router.post('/', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const key = req.get(authHeader);
  console.log('upload with key', key);

  console.log(req.query.fileId);

  const fileId = req.query.fileId ? req.query.fileId : getId();
  const uploadedFile = req.files.file;

  const subDirId = fileId.substring(0, 4);
  
  const subDirPath = path.join(config.uploadDir, subDirId);
  await fs.mkdir(subDirPath, { recursive: true });
  
  const uploadPathFile = path.join(subDirPath, fileId);
  const uploadPathMetadata = path.join(subDirPath, fileId + '.json');
  
  const metadata = {
    ...prepareMetadata(uploadedFile),
    fileId,
    key,
  };
  console.log('upload', JSON.stringify(metadata));

  await uploadedFile.mv(uploadPathFile);
  await fs.writeFile(uploadPathMetadata, JSON.stringify(metadata, null, 2));

  res.json({
    fileId,
    url: `${config.baseUrl}/file/${fileId}`,
    status: 'OK',
  });

  await postUploadAction(metadata);
});

module.exports = router;
