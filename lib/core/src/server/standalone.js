import { buildStaticStandalone } from './build-static';
import { buildDevStandalone } from './build-dev';

async function build(options = {}, frameworkOptions = {}) {
  const { mode = 'dev' } = options;

  const commonOptions = {
    ...options,
    ...frameworkOptions,
    frameworkPresets: [
      ...(options.frameworkPresets || []),
      ...(frameworkOptions.frameworkPresets || []),
    ],
  };

  if (mode === 'dev') {
    return buildDevStandalone(commonOptions);
  }

  if (mode === 'static') {
    return buildStaticStandalone(commonOptions);
  }

  throw new Error(`'mode' parameter should be either 'dev' or 'static'`);
}

export default build;
