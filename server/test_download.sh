#!/bin/sh

curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"url":"https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg"}' \
  -H "X-API-Key: test" \
  http://localhost:3007/download