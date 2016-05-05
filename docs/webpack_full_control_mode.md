# Taking Full Control of the Webpack Config

There are so many configuration options. We give a sane config by default, but sometimes you just need to take the wheel.

> Beware: You will be in full control of the webpack config and could easily break storybook. We have the important bits listed below.

## Full Control Mode

You'll need to add a `webpack.config.js` file to your config folder (`.storybook/` by default.

In the `webpack.config.js`, return a **Function** instead of an object. The function will receive our base config. You can make modifications to it or create a brand new one. The function just needs to return a valid webpack config.

Example:

 ```js
// .storybook/webpack.config.js

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig) => {
  // Make whatever fine-grained changes you need
  storybookBaseConfig.module = { ... }

  // Return the altered config
  return storybookBaseConfig;
};
 ```

Pretty straightforward :)

## Important Parts

The following sections of the config could break storybook if deleted:

- `config.entry`
- `config.output`
- `config.plugins[new webpack.HotModuleReplacementPlugin()]`

You've been warned.