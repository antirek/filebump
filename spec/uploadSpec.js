const fs = require('fs/promises');

const {FilebumpClient} = require('../client');
const {createApp} = require('../app');

const config = {
  port: 3007,
  baseUrl: 'http://localhost:3007',
  uploadDir: '/tmp/uploads',
  keys: [
    'test',
    'test2',
  ],
}

const app = createApp(config);
const server = app.listen(config.port);

describe('test upload', () => {
  it('pdf', async () => {
    
    const url = 'http://localhost:3007';
    const client = new FilebumpClient({url, key: 'test'});
    
    const filename = 'spec/test.pdf';
    const data = await fs.readFile(filename);

    const resp = await client.upload(data, filename);  
    console.log(resp.data);
    
  });  
});

afterAll(() => {
  server.close();
});