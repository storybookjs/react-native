#!/usr/bin/env bash
#
# This builds all the example storybooks for running chromatic on your dev machine

examples=(angular-cli ember-cli cra-kitchen-sink cra-ts-kitchen-sink html-kitchen-sink marko-cli mithril-kitchen-sink polymer-cli preact-kitchen-sink vue-kitchen-sink svelte-kitchen-sink official-storybook riot-kitchen-sink cra-react15)

for example in "${examples[@]}"
do
    pushd examples/$example
    yarn build-storybook
    popd
done
