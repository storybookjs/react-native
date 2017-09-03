#!/bin/bash

set -e

rsync -rl --delete fixtures/ run
cd run

for dir in *
do
  cd $dir
  ../../../bin/index.js
  cd ..
done

cd ..

# snapshot tests run only on node >= 6
../node_modules/.bin/check-node-version --node '>=6' || exit 0

update=0

while getopts ":u" opt; do
  case $opt in
    u)
      update=1
      ;;
  esac
done

if [ $update -eq 1 ]
  then
    rsync -r --exclude={node_modules**,yarn.lock,.DS_Store,*.md} run/ snapshots
  else
    declare diff=`diff -rq -x node_modules** -x yarn.lock -x .DS_Store -x *.md run snapshots`
    if [[ $diff ]]
    then
      echo "$diff" 1>&2
      echo "Snapshots don't match. Inspect your code changes or run 'yarn test -- --cli --update' to update them" 1>&2
      exit 1
    fi
  fi
