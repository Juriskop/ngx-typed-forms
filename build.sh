#!/bin/bash

rm -rf ./dist && mkdir -p ./dist

cp -r src/* ./dist/

cp ./package.json ./dist/package.json
cp ./README.md ./dist/README.md
cp ./LICENSE ./dist/LICENSE