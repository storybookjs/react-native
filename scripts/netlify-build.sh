#!/bin/sh

mkdir netlify-build
yarn
yarn add gauge --ignore-workspace-root-check
yarn bootstrap --core
pushd examples/cra-kitchen-sink
yarn build-storybook
mv storybook-static ../../netlify-build
popd
pushd examples/vue-kitchen-sink
yarn build-storybook
mv storybook-static ../../netlify-build
