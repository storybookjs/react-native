interface EntrySwap {
  appEntryPoint: string;
  storybookEntryPoint: string;
}

export function enhanceRepackConfig<T extends Record<string, any>>(
  config: T,
  swap?: EntrySwap
): T {
  if (!swap) {
    return config;
  }

  return {
    ...config,
    entry: swap.storybookEntryPoint,
  } as T;
}
