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

let server, client;

beforeAll(() => {
  const app = createApp(config);
  server = app.listen(config.port);

  const url = 'http://localhost:3007';
  client = new FilebumpClient({url, key: 'test'});
});


describe('test upload', () => {
  it('application/pdf', async () => {
    const filename = 'spec/test.pdf';
    const data = await fs.readFile(filename);

    const resp = await client.upload(data, filename);  
    console.log(resp.data);
    const successResponse = resp.data;
    expect(successResponse.fileId).toBeDefined();
    expect(successResponse.url).toBeDefined();
    expect(successResponse.status).toBeDefined();
  });  

  it('audio/ogg with post upload action', async () => {    
    const filename = 'spec/test.ogg';
    const data = await fs.readFile(filename);

    const resp = await client.upload(data, filename);  
    console.log(resp.data);
    const successResponse = resp.data;
    expect(successResponse.fileId).toBeDefined();
    expect(successResponse.url).toBeDefined();
    expect(successResponse.status).toBeDefined();
  });  
});

afterAll(() => {
  server.close();
});