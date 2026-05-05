interface EnhanceRepackOptions {
  swap?: {
    appEntryPoint: string;
    storybookEntryPoint: string;
  };
  /**
   * When true, removes the default Storybook UI (`@storybook/react-native-ui`)
   * from the bundle so it can be used without its full dependency set.
   * The `-lite` and `-common` variants remain available.
   */
  liteMode?: boolean;
}

export function enhanceRepackConfig<T extends Record<string, any>>(
  config: T,
  options: EnhanceRepackOptions = {}
): T {
  const { swap, liteMode = false } = options;

  if (!swap && !liteMode) {
    return config;
  }

  const result: Record<string, any> = { ...config };

  if (swap) {
    result.entry = swap.storybookEntryPoint;
  }

  if (liteMode) {
    // rspack/webpack supports `false` as an alias value to produce an empty module.
    // The `$` suffix ensures exact match so -lite and -common variants are not affected.
    const resolve = { ...(result.resolve ?? {}) };
    resolve.alias = {
      ...(resolve.alias ?? {}),
      '@storybook/react-native-ui$': false,
    };
    result.resolve = resolve;
  }

  return result as T;
}
