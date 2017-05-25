#!/bin/bash
set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not releasing"
  exit 0
fi

if [[ $TRAVIS_BRANCH == 'source' ]]; then
  npm run build
  git config --global user.email "nobody@nobody.org"
  git config --global user.name "Travis CI"
  npm run deploy-travis
fi
