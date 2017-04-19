#!/bin/bash

rm -rf ./dist
node_modules/.bin/babel --ignore __tests__ --plugins "transform-runtime" ./src --out-dir ./dist
