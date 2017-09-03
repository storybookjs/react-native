#!/bin/bash

set -e

function update_fixture {
  rm -rfd $2

  if [ $2 == "react_native_scripts" ]
  then
    echo "create-react-native-app requires node >=6. Checking..."
    ../../node_modules/.bin/check-node-version --node '>=6' || return 0
  fi

  ../../node_modules/.bin/npx $1 $2
}

cd fixtures
update_fixture create-react-app react_scripts
update_fixture create-react-native-app react_native_scripts
