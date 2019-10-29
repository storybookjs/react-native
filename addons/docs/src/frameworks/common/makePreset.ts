import fs from 'fs';
import * as common from './preset';

const makePreset = (framework: string) => {
  const docsConfig = [`${__dirname}/config.js`];
  const frameworkConfig = `${__dirname}/../../../dist/frameworks/${framework}/config.js`;
  if (fs.existsSync(frameworkConfig)) {
    docsConfig.push(frameworkConfig);
  }
  function config(entry: any[] = []) {
    return [...docsConfig, ...entry];
  }

  const configureJSX = framework !== 'react';
  const webpack = (webpackConfig: any, options: any) =>
    common.webpack(webpackConfig, { configureJSX, ...options });

  return {
    ...common,
    webpack,
    config,
  };
};

export default makePreset;
