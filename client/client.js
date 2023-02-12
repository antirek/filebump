const FormData = require('form-data');
const axios = require('axios');

class FilebumpClient {
  constructor ({url, key}) {
    this.url = url;
    this.key = key;
  }

  async upload(data, filename, fileId = null) {
    const form = new FormData();
    form.append('file', data, filename);

    const request_config = {
      headers: {
        'X-API-Key': this.key,
        ...form.getHeaders(),
      }
    };

    const qs = fileId ? `?fileId=${fileId}` : '';
    const url = `${this.url}/upload${qs}`;
    return await axios.post(url, form, request_config);
  }

  async download(downloadUrl) {
    const request_config = {
      headers: {
        'X-API-Key': this.key,
      }
    };

    const url = `${this.url}/download`;
    return await axios.post(url, {url: downloadUrl}, request_config);
  }

  async file(fileId) {
    const request_config = {
      headers: {
        'X-API-Key': this.key,
      }
    };

    const url = `${this.url}/file/${fileId}`;
    return await axios.get(url, request_config);
  }
}

module.exports = {
  FilebumpClient,
}
