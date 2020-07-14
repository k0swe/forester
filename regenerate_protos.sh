#!/bin/bash

./node_modules/.bin/pbjs -t static-module -w commonjs -o src/generated/adif.js ../adif-json-protobuf/adif.proto
./node_modules/.bin/pbts -o src/generated/adif.d.ts src/generated/adif.js
