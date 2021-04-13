const FormData = require('form-data'); // npm install --save form-data
const fs = require('fs');
const axios = require('axios');

const run = async () => {
  const form = new FormData();
  form.append('file', fs.createReadStream('test.pdf'));

  const url = 'http://localhost:3007/upload/';

  const request_config = {
    headers: {
      'X-API-Key': 'test',
      ...form.getHeaders()
    }
  };

  const resp = await axios.post(url, form, request_config);
  console.log(resp.data);
}

(run)();