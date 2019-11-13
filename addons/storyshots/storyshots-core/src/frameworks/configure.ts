import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { ClientApi } from '@storybook/client-api';
// @ts-ignore I don't know why this isn't in the interface, it should be
import { storyNameFromExport } from '@storybook/router/utils';
import { DecoratorFunction } from '@storybook/addons';
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

function matches(storyKey: string, arrayOrRegex: string[] | RegExp) {
  if (Array.isArray(arrayOrRegex)) {
    return arrayOrRegex.includes(storyKey);
  }
  return storyKey.match(arrayOrRegex);
}

function isExportStory(key: string, { includeStories, excludeStories }: any) {
  return (
    // https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs
    key !== '__esModule' &&
    (!includeStories || matches(key, includeStories)) &&
    (!excludeStories || !matches(key, excludeStories))
  );
}

const loadStories = (loadable: string, framework: string, clientApi: ClientApi) => {
  const currentExports = new Map();

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const exported = require(loadable);

  // An old-style story file
  if (!exported.default) {
    return;
  }

  if (!exported.default.title) {
    throw new Error(`Unexpected default export without title: ${JSON.stringify(exported.default)}`);
  }

  const { default: meta, ...exports } = exported;
  const { title: kindName, parameters: params, decorators: decos, component } = meta;

  // @ts-ignore We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
  const kind = clientApi.storiesOf(kindName, true);

  // we should always have a framework, rest optional
  kind.addParameters({
    framework,
    component,
    fileName: currentExports.get(exported),
    ...params,
  });

  (decos || []).forEach((decorator: DecoratorFunction) => {
    kind.addDecorator(decorator);
  });

  Object.keys(exports).forEach(key => {
    if (isExportStory(key, meta)) {
      const storyFn = exports[key];
      const { name, parameters, decorators } = storyFn.story || {};
      const decoratorParams = decorators ? { decorators } : null;
      const displayNameParams = name ? { displayName: name } : {};
      kind.add(storyNameFromExport(key), storyFn, {
        ...parameters,
        ...decoratorParams,
        ...displayNameParams,
      });
    }
  });
};

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
  const { configPath = '.storybook', config, storybook, framework } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const { files, stories } = getConfigPathParts(configPath);

  files.forEach(f => {
    require.requireActual(f);
  });

  stories.forEach(file => {
    loadStories(file, framework, storybook);
  });
}

export default configure;
