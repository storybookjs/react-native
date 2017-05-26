#!/bin/bash
set -e

if [ "$TRAVIS_PULL_REQUEST" != 'false' ]; then
  echo "We are in a pull request, not releasing"
  exit 0
fi

if [[ $TRAVIS_BRANCH == 'master' ]]; then
  # setup git user
  git config --global user.email "nobody@nobody.org"
  git config --global user.name "Travis CI"

  # deploy documentation to github-pages
  npm run docs:build
  npm run docs:deploy:ci
fi
