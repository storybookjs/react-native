function mergeConfigs(config, customConfig) {
  return {
    ...customConfig,
    // We'll always load our configurations after the custom config.
    // So, we'll always load the stuff we need.
    ...config,
    // Override with custom devtool if provided
    devtool: customConfig.devtool || config.devtool,
    // We need to use our and custom plugins.
    plugins: [...config.plugins, ...(customConfig.plugins || [])],
    module: {
      ...config.module,
      // We need to use our and custom rules.
      ...customConfig.module,
      rules: [
        ...config.module.rules,
        ...((customConfig.module && customConfig.module.rules) || []),
      ],
    },
    resolve: {
      ...config.resolve,
      ...customConfig.resolve,
      alias: {
        ...config.resolve.alias,
        ...(customConfig.resolve && customConfig.resolve.alias),
      },
      extensions: [
        ...config.resolve.extensions,
        ...(customConfig.resolve && customConfig.resolve.extensions),
      ],
    },
  };
}

export default mergeConfigs;
