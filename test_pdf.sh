#!/bin/sh

curl \
  -F "file=@test.pdf" \
  http://localhost:3000/upload