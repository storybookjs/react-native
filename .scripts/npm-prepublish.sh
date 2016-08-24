#!/bin/bash

rm -rf ./dist
node_modules/.bin/babel --ignore __tests__ ./src --out-dir ./dist
