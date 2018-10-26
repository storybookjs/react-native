import path from 'path';
import { getEnvironment } from 'lazy-universal-dotenv';

export const includePaths = [path.resolve('./')];
export const nodeModulesPaths = path.resolve('./node_modules');
export const excludePaths = [nodeModulesPaths];

// Load environment variables starts with STORYBOOK_ to the client side.
export function loadEnv(options = {}) {
  const defaultNodeEnv = options.production ? 'production' : 'development';
  const env = {
    NODE_ENV: process.env.NODE_ENV || defaultNodeEnv,
    // This is to support CRA's public folder feature.
    // In production we set this to dot(.) to allow the browser to access these assets
    // even when deployed inside a subpath. (like in GitHub pages)
    // In development this is just empty as we always serves from the root.
    PUBLIC_URL: options.production ? '.' : '',
  };

  Object.keys(process.env)
    .filter(name => /^STORYBOOK_/.test(name))
    .forEach(name => {
      env[name] = process.env[name];
    });

  const base = Object.entries(env).reduce(
    (acc, [k, v]) => Object.assign(acc, { [k]: JSON.stringify(v) }),
    {}
  );

  const { stringified, raw } = getEnvironment({ nodeEnv: env.NODE_ENV });

  return {
    stringified: Object.assign({}, base, stringified),
    raw: Object.assign({}, env, raw),
  };
}

export const getBabelRuntimePath = () => {
  const pkgJsonPath = require.resolve('@babel/runtime/package.json');
  return path.dirname(pkgJsonPath);
};
