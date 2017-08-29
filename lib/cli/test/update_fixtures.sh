#!/bin/bash

set -e -x

function update_fixture {
  rm -rf $2

  if [ $2 == "react_native_scripts" ]
  then
    ../../node_modules/.bin/check-node-version --node '>=6' --quiet ||
        (echo "create-react-native-app requires node >=6" && return 0)
  fi

  yarn create $1 $2
}

cd fixtures
update_fixture react-app react_scripts
update_fixture react-native-app react_native_scripts
