#!/bin/bash

# exit on error
set -e

# remove and recreate `cra-fixtures` directory
rm -rfd cra-fixtures
mkdir cra-fixtures
cd cra-fixtures

npx create-react-app react-scripts-latest-fixture

cd ..
./run_tests.sh -f cra-fixtures $@
