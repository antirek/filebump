const express = require('express');
const cors = require('cors');

const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');
const fileRouter = require('./routes/file');

const createApp = (config) => {
  const app = express();

  app.use(cors());
  app.use('/upload', uploadRouter);
  app.use('/download', downloadRouter);
  app.use('/file', fileRouter);

  return app;
};

module.exports = {
  createApp,
};
