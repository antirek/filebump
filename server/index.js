const config = require('config');
const {createApp} = require('./app');

const app = createApp(config);

app.listen(config.port, () => {
  console.log('app started with config:', config);
});