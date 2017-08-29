#!/bin/bash

set -e -x

cd ..
yarn unlink
yarn link
cd test

rm -rf run
cp -r fixtures run
cd run

for dir in *
do
  cd $dir
  getstorybook
  cd ..
done

echo SUCCESS