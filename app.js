const config = require('config');
const express = require('express');

const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');
const fileRouter = require('./routes/file');

const app = express();

app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/file', fileRouter);

app.listen(config.port, () => {
  console.log('app started with config:', config);
});
