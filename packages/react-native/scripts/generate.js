const {
  toRequireContext,
  ensureRelativePathHasDot,
  getPreviewExists,
  resolveAddonFile,
  getAddonName,
} = require('./common');
const {
  normalizeStories,
  globToRegexp,
  loadMainConfig,
  getInterpretedFile,
} = require('storybook/internal/common');
const { interopRequireDefault } = require('./require-interop');
const fs = require('fs');
const { networkInterfaces } = require('node:os');

const path = require('path');

const cwd = process.cwd();

const loadMain = async ({ configPath, cwd }) => {
  try {
    const main = await loadMainConfig({ configDir: configPath, cwd });
    return main;
  } catch {
    console.error('Error loading main config, trying fallback');
  }

  const mainPath = getInterpretedFile(path.resolve(cwd, configPath, 'main'));
  if (!mainPath) {
    throw new Error(`Main config file not found in ${path.resolve(cwd, configPath)}`);
  }
  return interopRequireDefault(mainPath);
};

/**
 * Resolves `main.storySorts`, which can be an array or a preset function that returns one.
 * @param {{ storySorts?: unknown }} main
 * @returns {Promise<unknown[] | undefined>}
 */
async function resolveMainStorySorts(main) {
  if (typeof main.storySorts === 'function') {
    return main.storySorts([], {});
  }

  return main.storySorts;
}

/**
 * Serializes `storySorts` into source for the requires file. Comparator functions are written out
 * from their source, so they can't use anything from outside their own body.
 * @param {unknown} value
 * @returns {string}
 */
function serializeStorySorts(value) {
  if (typeof value === 'function') {
    return `(${value.toString()})`;
  }

  if (Array.isArray(value)) {
    return `[${value.map(serializeStorySorts).join(', ')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, entry]) => `${JSON.stringify(key)}: ${serializeStorySorts(entry)}`
    );
    return `{ ${entries.join(', ')} }`;
  }

  return JSON.stringify(value);
}

/**
 * Get the local IP address of the machine.
 * @returns The local IP address of the machine.
 */
function getLocalIPAddress() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        return net.address;
      }
    }
  }
  return '0.0.0.0';
}

/**
 * @param {{
 *   configPath: string;
 *   useJs?: boolean;
 *   docTools?: boolean;
 *   host?: string;
 *   port?: number;
 *   secured?: boolean;
 *   disableUI?: boolean;
 * }} generateOptions
 */
async function generate(generateOptions) {
  const {
    configPath,
    useJs = false,
    docTools = true,
    host = undefined,
    port = undefined,
    secured = false,
    disableUI = false,
  } = generateOptions;
  // here we want to get the ip address and pass it to rn storybook so that devices can connect over lan easily
  const channelHost = host === 'auto' ? getLocalIPAddress() : host;
  const storybookRequiresLocation = path.resolve(
    cwd,
    configPath,
    `storybook.requires.${useJs ? 'js' : 'ts'}`
  );

  const main = await loadMain({ configPath, cwd });

  const storySorts = await resolveMainStorySorts(main);

  const storiesSpecifiers = normalizeStories(main.stories, {
    configDir: configPath,
    workingDir: cwd,
  });

  const normalizedStories = storiesSpecifiers.map((specifier) => {
    // TODO why????
    const reg = globToRegexp(`./${specifier.files}`);

    const { path: p, recursive: r, match: m } = toRequireContext(specifier);

    const pathToStory = ensureRelativePathHasDot(path.posix.relative(configPath, p));
    return `{
    titlePrefix: "${specifier.titlePrefix}",
    directory: "${specifier.directory}",
    files: "${specifier.files}",
    importPathMatcher: /${reg.source}/,
    req: require.context(
      '${pathToStory}',
      ${r},
      ${m}
    ),
  }`;
  });

  const registeredAddons = [];

  const allAddons = main.deviceAddons ?? [];

  for (const addon of allAddons) {
    const registerPath = resolveAddonFile(
      getAddonName(addon),
      'register',
      ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      configPath
    );

    if (registerPath) {
      registeredAddons.push(`import "${registerPath}";`);
    }
  }

  const docToolsAnnotation = 'require("@storybook/react-native/preview")';

  const enhancers = [];

  if (docTools) {
    enhancers.push(docToolsAnnotation);
  }

  for (const addon of allAddons) {
    const previewPath = resolveAddonFile(
      getAddonName(addon),
      'preview',
      ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      configPath
    );

    if (previewPath) {
      enhancers.push(`require('${previewPath}')`);
      continue;
    }
  }

  let options = '';
  let optionsVar = '';
  const reactNativeOptions = main.reactNative ?? {};

  if (disableUI) {
    reactNativeOptions.disableUI = true;
  }

  if (reactNativeOptions && typeof reactNativeOptions === 'object') {
    optionsVar = `const options = ${JSON.stringify(reactNativeOptions, null, 2)}`;
    options = 'options';
  }

  // Collect features from main config to set on globalThis.FEATURES
  let featuresAssignment = '';
  const features = main.features;

  if (features && typeof features === 'object') {
    const featureEntries = Object.entries(features).filter(
      ([, value]) => typeof value === 'boolean'
    );

    if (featureEntries.length > 0) {
      const assignments = featureEntries
        .map(([key, value]) => `globalThis.FEATURES.${key} = ${value};`)
        .join('\n');
      featuresAssignment = assignments;
    }
  }

  const previewExists = getPreviewExists({ configPath });

  if (previewExists) {
    enhancers.unshift("require('./preview')");
  }

  const annotations = `[
  ${enhancers.join(',\n  ')}
]`;

  const hasWebsocketConfig = host !== undefined || port !== undefined || secured;
  const websocketAssignmentLines = [];

  if (channelHost) {
    websocketAssignmentLines.push(`host: '${channelHost}',`);
  }

  if (hasWebsocketConfig) {
    websocketAssignmentLines.push(`port: ${port ?? 7007},`);
    websocketAssignmentLines.push(`secured: ${Boolean(secured)},`);
  }

  const globalTypes = `
declare global {
  var view: View;
  var STORIES: typeof normalizedStories;
  var STORYBOOK_WEBSOCKET:
    | { host?: string; port?: number; secured?: boolean }
    | undefined;
  var FEATURES: Features;
}
`;

  const fileContent = `/* do not change this file, it is auto generated by storybook. */
${useJs ? '' : '/// <reference types="@storybook/react-native/metro-env" />\n'}import { start, updateView${useJs ? '' : ', type View, type Features'} } from '@storybook/react-native';


${registeredAddons.join('\n')}

const normalizedStories = [
  ${normalizedStories.join(',\n  ')}
];

${useJs ? '' : globalTypes}

const annotations = ${annotations};

globalThis.STORIES = normalizedStories;
${
  hasWebsocketConfig
    ? `globalThis.STORYBOOK_WEBSOCKET = {
  ${websocketAssignmentLines.join('\n  ')}
};`
    : ''
}

module?.hot?.accept?.();
${featuresAssignment ? `\n${featuresAssignment}\n` : ''}
${optionsVar}
${storySorts ? `\nconst storySorts${useJs ? '' : ": NonNullable<Parameters<typeof start>[0]['storySorts']>"} = ${serializeStorySorts(storySorts)};\n` : ''}
if (!globalThis.view) {
  globalThis.view = start({
    annotations,
    storyEntries: normalizedStories,
${options ? `    ${options},` : ''}${storySorts ? '\n    storySorts,' : ''}
  });
} else {
  updateView(globalThis.view, annotations, normalizedStories${options ? `, ${options}` : storySorts ? ', undefined' : ''}${storySorts ? ', storySorts' : ''});
}

export const view${useJs ? '' : ': View'} = globalThis.view;
`;

  fs.writeFileSync(storybookRequiresLocation, fileContent, {
    encoding: 'utf8',
    flag: 'w',
  });
}

module.exports = {
  generate,
};
