---
id: 'introduction'
title: 'Intro to Presets'
---

Storybook **presets** are grouped collections of `babel`, `webpack`, and `addons` configurations that support specific use cases.

For example, to write your stories in Typescript, rather than [manually configuring Storybook for typescript](../configurations/typescript-config/) with individual [babel](../configurations/custom-babel-config/) and [webpack](../configurations/custom-webpack-config/) configs, you can simply use the `@storybook/preset-typescript` package, which does the heavy lifting for you.

## Using presets

Each preset has its own installation instructions, but the idea of presets is to simply install the preset and then load it.

For example, to get typescript support, first install the preset:

```sh
yarn add @storybook/preset-typescript
```

Then load it in the file `presets.js` in your storybook folder (`.storybook` by default):

```js
module.exports = {
  '@storybook/preset-typescript'
}
```

That's it. When Storybook starts up, it will configure itself for typescript without any further configuration. For more information, see the Typescript preset [README](https://github.com/storybooks/presets/tree/master/packages/preset-typescript).

## Go deeper

To see what presets are available, see the [preset gallery](../preset-gallery/). To understand more about how presets work and write your own, see [writing presets](../writing-presets/).
