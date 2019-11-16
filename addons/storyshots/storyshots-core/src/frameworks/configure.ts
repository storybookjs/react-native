import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { ClientApi } from './Loader';
import { StoryshotsOptions } from '../api/StoryshotsOptions';

const isFile = (file: string): boolean => {
  try {
    return fs.lstatSync(file).isFile();
  } catch (e) {
    return false;
  }
};

interface Output {
  stories: string[];
  files: string[];
}

const getPreviewFile = (configDir: string): string | false => {
  const preview = path.join(configDir, 'preview.js');
  const previewTS = path.join(configDir, 'preview.ts');
  const config = path.join(configDir, 'config.js');
  const configTS = path.join(configDir, 'config.ts');

  if (isFile(previewTS)) {
    return previewTS;
  }
  if (isFile(preview)) {
    return preview;
  }
  if (isFile(configTS)) {
    return configTS;
  }
  if (isFile(config)) {
    return config;
  }

  return false;
};

const getMainFile = (configDir: string): string | false => {
  const main = path.join(configDir, 'main.js');

  if (isFile(main)) {
    return main;
  }

  return false;
};

function getConfigPathParts(input: string): Output {
  const configDir = path.resolve(input);

  if (fs.lstatSync(configDir).isDirectory()) {
    const output: Output = { files: [], stories: [] };

    const preview = getPreviewFile(configDir);
    const main = getMainFile(configDir);

    if (preview) {
      output.files.push(preview);
    }
    if (main) {
      const { stories = [] } = require.requireActual(main);

      const result = stories.reduce((acc: string[], i: string) => [...acc, ...glob.sync(i)], []);

      output.stories = result;
    }

    return output;
  }

  return { files: [configDir], stories: [] };
}

function configure(
  options: {
    storybook: ClientApi;
  } & StoryshotsOptions
): void {
  const { configPath = '.storybook', config, storybook } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const { files, stories } = getConfigPathParts(configPath);

  files.forEach(f => {
    require.requireActual(f);
  });

  if (stories && stories.length) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    storybook.configure(() => stories.map(f => require(f)), false);
  }
}

export default configure;
