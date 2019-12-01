# Storybook Essentials

Storybook Essentials is a curated collection of addons to bring out the best of Storybook.

Each addon is documented and maintained by the core team and will be upgraded alongside Storybook as the platform evolves. We will also do our best to maintain [framework support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md) for all of the officially supported frameworks.

## Contents

Storybook essentials includes the following addons. Addons can be disabled and re-configured as [described below](#configuration):

- [Actions](https://github.com/storybookjs/storybook/tree/next/addons/actions)
- [Backgrounds](https://github.com/storybookjs/storybook/tree/next/addons/backgrounds)
- [Knobs](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [Links](https://github.com/storybookjs/storybook/tree/next/addons/links)
- [Viewport](https://github.com/storybookjs/storybook/tree/next/addons/viewport)

## Installation

You can add Essentials to your project with:

```
npm install --save-dev @storybook/addon-essentials
```

And then add the following line to your `.storybook/main.js`:

```js
module.exports = {
  presets: ['@storybook/addon-essentials'],
};
```

## Configuration

Essentials is "zero config." That means that comes with a recommended configuration out of the box. But it's flexible -- you can disable or reconfigure any of the addons using the following configuration scheme in `.storybook/main.js`:

```js
module.exports = {
  presets: [{
    name: '@storybook/addon-essentials'],
    options: {
      <key>: <value>
    }
  }]
};
```

Each `key` corresponds to the addon you wish to configure. Each `value` corresponds to the preset configuration value (typically an object) for that specific addon, or `null` to disable that addon.

For example, suppose we want to disable the `backgrounds` addon and configure `knobs` not to add a global decorator automatically to your project:

```js
module.exports = {
  presets: [{
    name: '@storybook/addon-essentials'],
    options: {
      backgrounds: null,
      knobs: { addDecorator: false },
    }
  }]
};
```

To read up on valid options for a specific addon, refer to the addon's documentation.

## FAQs

### What if I'm already using an addon in my app?

If `addon-essentials` detects that one of its addons is installed in your `package.json`, it emits the following warning to your console:

```
${addon}@${version} found in package.json, consider removing it from your app or disabling it in addon-essentials
```

To remove the addon from your app, simply remove the corresponding dependency from `package.json` and potentially any addon-specific configuration you might have applied in any of your config files. This will cause Storybook to use the addon-essentials configuration for that addon.

To disable the addon in addon-essentials, simply set the addon's key in the preset to `null`, per the [configuration instructions above](#configuration).

For example, suppose I've already set up `addon-knobs` prior to adding addon essentials, and I'd prefer to use that setup. I could add the following to `.storybook/main.js`

```js
module.exports = {
  presets: [{
    name: '@storybook/addon-essentials'],
    options: { knobs: null }
  }]
};
```
