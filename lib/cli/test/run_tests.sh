#!/bin/bash

# exit on error
set -e

declare test_root=$PWD

# remove run directory before exit to prevent yarn.lock spoiling
function cleanup {
  rm -rfd ${test_root}/run
}
trap cleanup EXIT

update=0
update_only=0
skip=0
fixtures_dir='fixtures'

# parse command-line options
# `-u` turns on snapshot update mode
# `-o` does the same, plus skips the smoke tests
# `-s` skips snapshot testing
# '-f' sets fixtures directory
while getopts ":uosf:" opt; do
  case $opt in
    u)
      update=1
      ;;
    o)
      update_only=1
      update=1
      ;;
    s)
      skip=1
      ;;
    f)
      fixtures_dir=$OPTARG
      ;;
  esac
done

# copy all files from fixtures directory to `run`
rsync -rl --delete --exclude=yarn.lock $fixtures_dir/ run
cd run

for dir in *
do
  cd $dir

  # run @storybook/cli
  ../../../bin/index.js --skip-install

  cd ..
done

cd ..

# snapshot tests run only on node >= 6
../node_modules/.bin/check-node-version --node '>=6' || exit 0


if [ $update -eq 1 ]
  then
    # copy `run` directory contents to `snapshots`, skipping irrelevant files
    rsync -r --exclude={node_modules**,.DS_Store,*.md} run/ snapshots
  else if [ $skip -eq 0 ]
    then
      # check if there is any difference between `run` and `snapshots` directories,
      # skipping irrelevant files
      declare diff=`diff -r -x node_modules** -x .DS_Store -x *.md run snapshots`
      if [[ $diff ]]
      then
        # if there is some diff, output it to stderr along with a clarifying message
        echo "$diff" 1>&2
        echo "Snapshots don't match. Inspect your code changes or run 'yarn test --cli --update' to update them" 1>&2
        exit 1
      fi
    fi
  fi

if [ $update_only -eq 1 ]
  then
    exit 0
  fi

# install all the dependencies in a single run
cd ../../..
yarn --pure-lockfile
cd ${test_root}/run

for dir in *
do
  # check that storybook starts without errors
  # smoke-test option may be unknown in earlier storybook versions,
  # so skip `already_has_storybook` here
  if [ $dir != "already_has_storybook" ]
    then
      cd $dir
      echo "Running smoke test in $dir"
      yarn storybook --smoke-test
      cd ..
    fi
done
