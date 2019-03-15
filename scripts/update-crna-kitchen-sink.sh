#!/bin/bash
# the crna-kitchen-sink app doesn't integrate with the yarn workspace very well.
# to enable 'quick' iteration on app/react-native,
# this script clears the yarn cache of the targballs and regenerate the relevant one.
set -e

rm -rf ~/Library/Caches/Yarn/v4/npm-@storybook**
rm -rf ~/Library/Caches/Yarn/v4/.tmp

cd app/react-native
yarn prepare
yarn pack
mv storybook-react-native-v5.1.0-alpha.6.tgz ../../packs/storybook-react-native.tgz
cd ../..

cd lib/client-api
yarn prepare
yarn pack
mv storybook-client-api-v5.1.0-alpha.6.tgz ../../packs/storybook-client-api.tgz
cd ../..

cd addons/ondevice-knobs
yarn prepare
yarn pack
mv storybook-addon-ondevice-knobs-v5.1.0-alpha.6.tgz ../../packs/storybook-ondevice-knobs.tgz
cd ../..

yarn
cd examples-native/crna-kitchen-sink
rm yarn.lock && rm -rf node_modules && yarn install