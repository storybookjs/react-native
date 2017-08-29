#!/bin/bash

set -e -x

function update_fixture {
  rm -rf $2
  ../../node_modules/.bin/$1 $2
}

cd fixtures
update_fixture create-react-app react_scripts
update_fixture create-react-native-app react_native_scripts
