#!/bin/sh

mkdir netlify-build

yarn
yarn add gauge --ignore-workspace-root-check # netlify quirk
yarn bootstrap --core

echo "netlify-build docs"
pushd docs
yarn install
popd
yarn docs:build
mv docs/public/* netlify-build/

echo "netlify-build React examples"
pushd examples/cra-kitchen-sink
yarn add tapable # netlify quirk
yarn build-storybook
mv storybook-static ../../netlify-build/cra-kitchen-sink
popd

echo "netlify-build Vue examples"
pushd examples/vue-kitchen-sink
yarn build-storybook
mv storybook-static ../../netlify-build/vue-kitchen-sink
popd

