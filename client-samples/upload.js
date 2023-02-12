const fs = require('fs/promises');
const {FilebumpClient} = require('filebump-client');

const filebumpClient = new FilebumpClient({
  url: 'http://localhost:3000',
  key: 'testKey1',
})



const start = async () => {
  const filebuffer = await fs.readFile('./test.png');
  const resp = await filebumpClient.upload(filebuffer, 'test.png');
  console.log('resp', resp);
}

(start)()
