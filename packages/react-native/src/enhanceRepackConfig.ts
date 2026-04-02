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
  const { swap } = options;

  if (!swap) {
    return config;
  }

  // TODO support liteMode

  return {
    ...config,
    entry: swap.storybookEntryPoint,
  } as T;
}
