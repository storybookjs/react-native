import * as path from 'path';
import { DOCUMENTED_PREVIEW_IMPORT } from './metro/previewAlias';

interface EnhanceRepackOptions {
  /** Storybook config directory. `#.storybook/preview` is aliased here. */
  configPath?: string;
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
  const {
    swap,
    liteMode = false,
    configPath = path.resolve(process.cwd(), './.rnstorybook'),
  } = options;

  const result: Record<string, any> = { ...config };
  const resolve = { ...(result.resolve ?? {}) };
  const alias = {
    ...(resolve.alias ?? {}),
    [DOCUMENTED_PREVIEW_IMPORT]: path.join(configPath, 'preview'),
  };

  if (liteMode) {
    // rspack/webpack supports `false` as an alias value to produce an empty module.
    // The `$` suffix ensures exact match so -lite and -common variants are not affected.
    alias['@storybook/react-native-ui$'] = false;
  }

  resolve.alias = alias;
  result.resolve = resolve;

  if (swap) {
    result.entry = swap.storybookEntryPoint;
  }

  return result as T;
}
