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
story_format='csf'

# parse command-line options
# '-f' sets fixtures directory
# '-s' sets story format to use
while getopts ":f:s:" opt; do
  case $opt in
    f)
      fixtures_dir=$OPTARG
      ;;
    s)
      story_format=$OPTARG
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

  case $story_format in
  csf)
    yarn sb init --skip-install --yes
    ;;
  mdx)
    if [[ $dir =~ (react_native*|angular-cli-v6|ember-cli|marko|meteor|mithril|polymer|riot|react_babel_6) ]]
    then
      yarn sb init --skip-install --yes
    else
      yarn sb init --skip-install --yes --story-format mdx
    fi
    ;;
  csf-ts)
    if [[ $dir =~ (react_scripts_ts) ]]
    then
      yarn sb init --skip-install --yes --story-format csf-ts
    else
      yarn sb init --skip-install --yes
    fi
    ;;
  esac
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
