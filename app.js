const config = require('config');
const express = require('express');

const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');

const app = express();

app.use('/upload', uploadRouter);
app.use('/file', downloadRouter);

app.listen(config.port, () => {
  console.log('app started with config:', config);
});
