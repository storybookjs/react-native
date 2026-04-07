interface EnhanceRepackOptions {
  swap?: {
    appEntryPoint: string;
    storybookEntryPoint: string;
  };
}

export function enhanceRepackConfig<T extends Record<string, any>>(
  config: T,
  options: EnhanceRepackOptions = {}
): T {
  const { swap } = options;

  if (!swap) {
    return config;
  }

  const result = {
    ...config,
    entry: swap.storybookEntryPoint,
  } as T;

  return result as T;
}
