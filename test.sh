#!/bin/sh

curl \
  -F "file=@test.png" \
  http://localhost:3000/upload