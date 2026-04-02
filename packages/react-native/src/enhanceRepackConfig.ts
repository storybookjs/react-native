interface EnhanceRepackOptions {
  swap?: {
    appEntryPoint: string;
    storybookEntryPoint: string;
  };
  liteMode?: boolean;
}

export function enhanceRepackConfig<T extends Record<string, any>>(
  config: T,
  options: EnhanceRepackOptions = {}
): T {
  const { swap, liteMode = false } = options;

  if (!swap) {
    return config;
  }

  const result = {
    ...config,
    entry: swap.storybookEntryPoint,
  } as T;

  if (liteMode) {
    const resolve = (result as any).resolve ?? {};
    const alias = resolve.alias ?? {};

    // rspack/webpack supports `false` as an alias value to produce an empty module.
    // The `$` suffix ensures exact match so -lite and -common variants are not affected.
    alias['@storybook/react-native-ui$'] = false;

    (result as any).resolve = { ...resolve, alias };
  }

  return result;
}
