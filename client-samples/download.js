const {FilebumpClient} = require('filebump-client');

const filebumpClient = new FilebumpClient({
  url: 'http://localhost:3000',
  key: 'testKey1',
})

const start = async () => {
  const resp = await filebumpClient.download('https://file-examples.com/storage/fe863385e163e3b0f92dc53/2017/10/file_example_JPG_100kB.jpg');
  console.log('resp', resp);
}

(start)()
