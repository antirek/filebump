const express = require('express');
const fileUpload = require('express-fileupload');
const { customAlphabet } = require('nanoid');
const fileExtension = require('file-extension');
const fs = require('fs');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 32);

const app = express();
app.use(fileUpload());

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const fileId = nanoid();
  const uploadedFile = req.files.file;
  const ext = fileExtension(uploadedFile.name);

  const uploadPathFile = __dirname + '/uploads/' + fileId;
  const uploadPathMetadata = __dirname + '/uploads/' + fileId + '.json';
  
  const metadata = {
    name: uploadedFile.name,
    mimetype: uploadedFile.mimetype,
    md5: uploadedFile.md5,
    size: uploadedFile.size,
    dateCreated: (+new Date()/1000).toFixed(0),
    fileId,
    ext,
  };

  uploadedFile.mv(uploadPathFile, (err) => {
    if (err)
      return res.status(500).json({err, status: 'ERROR'});
    fs.writeFileSync(uploadPathMetadata, JSON.stringify(metadata, null, 2));
    res.json({fileId, status: 'OK'});
  });
});

app.get('/file/:fileId', async(req, res) => {
  const {fileId} = req.params;
  console.log('f', fileId);

  const uploadPathFile = __dirname + '/uploads/' + fileId;
  const uploadPathMetadata = __dirname + '/uploads/' + fileId + '.json';

  const metadata = JSON.parse(fs.readFileSync(uploadPathMetadata));
  console.log('m', metadata);

  res.sendFile(uploadPathFile, {
    headers: {
      'Content-Type': metadata.mimetype,
    },
  });
});

app.listen(3000);
