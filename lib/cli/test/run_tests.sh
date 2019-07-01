#!/bin/bash

# exit on error
set -e

declare test_root=$PWD

# remove run directory before exit to prevent yarn.lock spoiling
function cleanup {
  rm -rfd ${test_root}/run
}
trap cleanup EXIT

fixtures_dir='fixtures'

# parse command-line options
# '-f' sets fixtures directory
while getopts ":f:" opt; do
  case $opt in
    f)
      fixtures_dir=$OPTARG
      ;;
  esac
done

# copy all files from fixtures directory to `run`
rm -rfd run
cp -r $fixtures_dir run
cd run

for dir in *
do
  cd $dir
  echo "Running storybook-cli in $dir"

  if [ $dir == *"native"* ]
  then
    # run @storybook/cli
    ../../../bin/index.js init --skip-install --yes --install-server
  else
    # run @storybook/cli
    ../../../bin/index.js init --skip-install --yes
  fi

  cd ..
done

cd ..

# install all the dependencies in a single run
cd ../../..
echo "Running bootstrap"
yarn install --non-interactive --silent --pure-lockfile
cd ${test_root}/run

for dir in *
do
  # check that storybook starts without errors
  cd $dir

  echo "Running smoke test in $dir"
  failed=0
  yarn storybook --smoke-test --quiet || failed=1

  if [ $failed -eq 1 ]
  then
    exit 1
  fi

  cd ..
done
