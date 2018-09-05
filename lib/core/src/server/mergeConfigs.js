function plugins({ plugins: defaultPlugins = [] }, { plugins: customPlugins = [] }) {
  return [...defaultPlugins, ...customPlugins];
}

function rules({ rules: defaultRules = [] }, { rules: customRules = [] }) {
  return [...defaultRules, ...customRules];
}

function extensions({ extensions: defaultExtensions = [] }, { extensions: customExtensions = [] }) {
  return [...defaultExtensions, ...customExtensions];
}

function alias({ alias: defaultAlias = {} }, { alias: customAlias = {} }) {
  return {
    ...defaultAlias,
    ...customAlias,
  };
}

function module({ module: defaultModule = {} }, { module: customModule = {} }) {
  return {
    ...defaultModule,
    ...customModule,
    rules: rules(defaultModule, customModule),
  };
}

function resolve({ resolve: defaultResolve = {} }, { resolve: customResolve = {} }) {
  return {
    ...defaultResolve,
    ...customResolve,
    alias: alias(defaultResolve, customResolve),
    extensions: extensions(defaultResolve, customResolve),
  };
}

function optimisation(
  { optimisation: defaultOptimisation = {} },
  { optimisation: customOptimisation = {} }
) {
  return {
    ...defaultOptimisation,
    ...customOptimisation,
  };
}

function mergeConfigs(config, customConfig) {
  return {
    // We'll always load our configurations after the custom config.
    // So, we'll always load the stuff we need.
    ...customConfig,
    ...config,
    devtool: customConfig.devtool || config.devtool,
    plugins: plugins(config, customConfig),
    module: module(config, customConfig),
    resolve: resolve(config, customConfig),
    optimisation: optimisation(config, customConfig),
  };
}

export default mergeConfigs;
