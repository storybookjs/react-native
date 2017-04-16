import { stripIndent } from 'common-tags';

export default {
  id: 'custom-webpack-config',
  title: 'Custom Webpack Config',
  content: stripIndent`
    The default Webpack config of React Storybook is usually well balanced for a medium-size React project (specially created with [Create React App](https://github.com/facebookincubator/create-react-app)) or a library. But if you already have your own Webpack setup, that's not useable.

    That's why we allow you to customize our Webpack setup. There are a few ways to do it. Let's discuss:

    ## Simple Mode

    Let's say you want to add [SASS](http://sass-lang.com/) support to Storybook. This is how to do it.
    Simply add the following content to a file called \`webpack.config.js\` in your Storybook config directory (\`.storybook\` by default ).

    ~~~js
    const path = require('path');

    module.exports = {
      module: {
        loaders: [
          {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"],
            include: path.resolve(__dirname, '../')
          }
        ]
      }
    }
    ~~~

    Since this config file stays in the Storybook directory, you need to set the include path as above. If the config directory stays in a different directory, you need to set the include path relative to that.

    You also need to install the loaders (style, css, and sass) used in above config manually.


    > Once you create this \`webpack.config.js\` file, Storybook won't load the [default Webpack config](/docs/react-storybook/configurations/default-config) other than loading JS files with the Babel loader.

    ### Supported Webpack Options

    You can add any kind of Webpack configuration options with the above config, whether they are plugins, loaders, or aliases.
    But you won't be able to change the following config options:

    * entry
    * output
    * js loader with babel

    ## Full Control Mode

    Sometimes, you will want to have full control over the webpack configuration. Maybe you want to add different configurations for dev and production environments. That's where you can use our full control mode.

    To enable that, you need to export a **function** from the above \`webpack.config.js\` file, just like this:

    ~~~js
    // Export a function. Accept the base config as the only param.
    module.exports = function(storybookBaseConfig, configType) {
      // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
      // You can change the configuration based on that.
      // 'PRODUCTION' is used when building the static version of storybook.

      // Make whatever fine-grained changes you need
      storybookBaseConfig.module.loaders.push({
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
        include: path.resolve(__dirname, '../')
      });

      // Return the altered config
      return storybookBaseConfig;
    };
    ~~~

    Storybook uses the config returned from the above function. So, try to edit the \`storybookBaseConfig\` with care. Make sure to preserve the following config options:

    * entry
    * output
    * first loader in the module.loaders (Babel loader for JS)

    Other than that, you should try to keep the default set of plugins.

    ## Extending The Default Config

    You may want to keep Storybook's [default config](/docs/react-storybook/configurations/default-config), but just need to extend it. If so, this is how you do it using the Full Control Mode.
    Add following content to the \`webpack.config.js\` in your Storybook config directory.

    ~~~js
    // load the default config generator.
    var genDefaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config.js');

    module.exports = function(config, env) {
      var config = genDefaultConfig(config, env);

      // Extend it as you need.

      return config;
    };
    ~~~

    ## Using Your Existing Config

    You may have an existing Webpack config for your project. So, you may need to copy and paste some config items into Storybook's custom Webpack config file.

    But you don't need to. There are a few options:

    * Simply import your main Webpack config into Storybook's \`webpack.config.js\` and use the loaders and plugins used in that.
    * Create a new file with common Webpack options and use it in both inside the main Webpack config and inside Storybook's \`webpack.config.js\`.
  `,
};
