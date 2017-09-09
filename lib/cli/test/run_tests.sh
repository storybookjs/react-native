#!/bin/bash

# exit on error
set -e

# copy all files from `fixtures` to `run`
rsync -rl --delete fixtures/ run
cd run

for dir in *
do
  cd $dir

  # run @storybook/cli
  ../../../bin/index.js

  # check that storybook starts without errors
  # smoke-test option may be unknown in earlier storybook versions,
  # so skip `already_has_storybook` here
# TODO uncomment when 3.3.0 gets released
#  if [ $dir != "already_has_storybook" ]
#  then
#    yarn storybook --smoke-test
#  fi

  cd ..
done

cd ..

# snapshot tests run only on node >= 6
../node_modules/.bin/check-node-version --node '>=6' || exit 0

update=0

# parse command-line options. `-u` turns on snapshot update mode
while getopts ":u" opt; do
  case $opt in
    u)
      update=1
      ;;
  esac
done

if [ $update -eq 1 ]
  then
    # copy `run` directory contents to `snapshots`, skipping irrelevant files
    rsync -r --exclude={node_modules**,yarn.lock,.DS_Store,*.md} run/ snapshots
  else
    # check if there is any difference between `run` and `snapshots` directories,
    # skipping irrelevant files
    declare diff=`diff -r -x node_modules** -x yarn.lock -x .DS_Store -x *.md run snapshots`
    if [[ $diff ]]
    then
      # if there is some diff, output it to stderr along with a clarifying message
      echo "$diff" 1>&2
      echo "Snapshots don't match. Inspect your code changes or run 'yarn test --cli --update' to update them" 1>&2
      exit 1
    fi
  fi
