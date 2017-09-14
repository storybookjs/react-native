#!/bin/bash

# exit on error
set -e

# create CR(N)A fixtures using latest versions of creators
function create_fixture {
  if [ $2 == "react_native_scripts" ]
  then
    echo "create-react-native-app requires node >=6. Checking..."
    ../../node_modules/.bin/check-node-version --node '>=6' || return 0
  fi

  # use `npx` rather then `yarn create` to avoid installing global deps
  ../../node_modules/.bin/npx $1 $2
}

# remove and recreate `cra-fixtures` directory
rm -rfd cra-fixtures
mkdir cra-fixtures
cd cra-fixtures

create_fixture create-react-app react-scripts-latest-fixture
create_fixture create-react-native-app react-native-scripts-latest-fixture

cd ..
./run_tests.sh -s -f cra-fixtures
