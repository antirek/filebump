#!/bin/sh

curl \
  -F "file=@test.pdf" \
  -H "X-API-Key: test" \
  http://localhost:3000/upload