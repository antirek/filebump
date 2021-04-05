const express = require('express');
const fileUpload = require('express-fileupload');
const { customAlphabet } = require('nanoid');
const fileExtension = require('file-extension');
const fs = require('fs');
const path = require('path');
const checkAuthHeader = require('check-auth-header');
const config = require('config');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 36);

const prepareMetadata = (uploadedFile) => {
  const ext = fileExtension(uploadedFile.name);
  return {
    name: uploadedFile.name,
    mimetype: uploadedFile.mimetype,
    md5: uploadedFile.md5,
    size: uploadedFile.size,
    dateCreated: (+new Date()/1000).toFixed(0),
    ext,
  };
};

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

  const fileId = nanoid();
  const uploadedFile = req.files.file;

  const subDirId = fileId.substring(0, 4);
  
  const subDirPath = path.join(config.uploadDir, subDirId);
  fs.mkdirSync(subDirPath, { recursive: true });
  
  const uploadPathFile = path.join(subDirPath, fileId);
  const uploadPathMetadata = path.join(subDirPath, fileId + '.json');
  
  const metadata = { 
    ...prepareMetadata(uploadedFile),
    fileId,
    key,
  };
  console.log('upload', JSON.stringify(metadata));
  uploadedFile.mv(uploadPathFile, (err) => {
    if (err)
      return res.status(500).json({err, status: 'ERROR'});
    fs.writeFileSync(uploadPathMetadata, JSON.stringify(metadata, null, 2));
    res.json({
      fileId,
      url: `${config.baseUrl}/download/${fileId}`,
      status: 'OK',
    });
  });
});

module.exports = router;