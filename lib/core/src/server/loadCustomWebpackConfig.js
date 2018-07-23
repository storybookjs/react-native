/* eslint-disable global-require, import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import interpret from 'interpret';
import { logger } from '@storybook/node-logger';

// Copied and modified from
// https://github.com/webpack/webpack-cli/blob/ca504de8c7c0ea66278021b72fa6a953e3ffa43c/bin/convert-argv.js#L102-L119
function registerCompiler(moduleDescriptor) {
  if (!moduleDescriptor) {
    return 0;
  }

  if (typeof moduleDescriptor === 'string') {
    require(moduleDescriptor);
    return 1;
  }

  if (!Array.isArray(moduleDescriptor)) {
    moduleDescriptor.register(require(moduleDescriptor.module));
    return 1;
  }

  let registered = 0;

  for (let i = 0; i < moduleDescriptor.length; i += 1) {
    try {
      registered += registerCompiler(moduleDescriptor[i]);
      break;
    } catch (e) {
      // do nothing
    }
  }

  return registered;
}

// Copied and modified from
// https://github.com/webpack/webpack-cli/blob/ca504de8c7c0ea66278021b72fa6a953e3ffa43c/bin/convert-argv.js#L121-L137
function requireConfig(configPath) {
  const config = require(configPath);

  const isES6DefaultExported =
    typeof config === 'object' && config !== null && typeof config.default !== 'undefined';

  return isES6DefaultExported ? config.default : config;
}

// Copied and modified from
// https://github.com/webpack/webpack-cli/blob/ca504de8c7c0ea66278021b72fa6a953e3ffa43c/bin/convert-argv.js#L45-L143
export default configDir => {
  const extensions = Object.keys(interpret.extensions).sort((a, b) => {
    if (a === '.js') {
      return -1;
    }
    if (b === '.js') {
      return 1;
    }
    return a.length - b.length;
  });

  const customConfigCandidates = ['webpack.config', 'webpackfile']
    .map(filename =>
      extensions.map(ext => ({
        path: path.resolve(configDir, filename + ext),
        ext,
      }))
    )
    .reduce((a, i) => a.concat(i), []);

  for (let i = 0; i < customConfigCandidates.length; i += 1) {
    const customConfigPath = customConfigCandidates[i].path;
    if (fs.existsSync(customConfigPath)) {
      if (registerCompiler(interpret.extensions[customConfigCandidates[i].ext]) === 0) {
        logger.warn(`=> Custom configuration file ${customConfigPath} is detected`);
        logger.warn(`   but impossible to import loader for ${customConfigCandidates[i].ext}`);
      }
      try {
        return requireConfig(customConfigPath);
      } catch (e) {
        // do nothing
      }
    }
  }

  return null;
};
