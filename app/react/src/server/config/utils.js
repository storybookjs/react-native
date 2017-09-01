import path from 'path';

export const includePaths = [path.resolve('./')];

export const excludePaths = [path.resolve('node_modules')];

export const nodeModulesPaths = path.resolve('./node_modules');

export const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(p => path.resolve('./', p));

// Load environment variables starts with STORYBOOK_ to the client side.
export function loadEnv(options = {}) {
  const defaultNodeEnv = options.production ? 'production' : 'development';
  const env = {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || defaultNodeEnv),
    // This is to support CRA's public folder feature.
    // In production we set this to dot(.) to allow the browser to access these assests
    // even when deployed inside a subpath. (like in GitHub pages)
    // In development this is just empty as we always serves from the root.
    PUBLIC_URL: JSON.stringify(options.production ? '.' : ''),
  };

  Object.keys(process.env)
    .filter(name => /^STORYBOOK_/.test(name))
    .forEach(name => {
      env[name] = JSON.stringify(process.env[name]);
    });

  return {
    'process.env': env,
  };
}

export const getConfigDir = () => process.env.SBCONFIG_CONFIG_DIR || './.storybook';
