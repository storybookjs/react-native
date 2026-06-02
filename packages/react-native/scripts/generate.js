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

const MAIN_ADDONS_DEPRECATION_URL =
  'https://github.com/storybookjs/react-native/blob/main/MIGRATION.md#deprecating-addons-in-rnstorybook-main';

/**
 * @param {{ addons?: unknown[] }} main
 * @param {string} configPath
 *
 * @todo Remove support for `main.addons` in a future major version.
 */
function warnDeprecatedMainAddonsField(main, configPath) {
  const addons = main.addons ?? [];
  if (addons.length === 0) {
    return;
  }

  const names = addons
    .map((addon) => getAddonName(addon))
    .filter((name) => typeof name === 'string');
  const list = [...new Set(names)].join(', ');
  console.warn(
    `[Storybook React Native] The \`addons\` field in your main config (${configPath}) is deprecated and will be removed in a future major version.\n` +
      `Move every entry to \`deviceAddons\` instead. That includes on-device UI packages (\`@storybook/addon-ondevice-*\`), other addons you bundle with the app (for example storybook-addon-deep-controls), and local paths such as ./my-addon.\n` +
      (list ? `Still listed under \`addons\`: ${list}.\n` : '') +
      `Details: ${MAIN_ADDONS_DEPRECATION_URL}`
  );
}

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

  warnDeprecatedMainAddonsField(main, configPath);

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

  const allAddons = [
    ...(main.addons ?? []), // TODO remove in v11
    ...(main.deviceAddons ?? []),
  ];

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

if (!globalThis.view) {
  globalThis.view = start({
    annotations,
    storyEntries: normalizedStories,
${options ? `    ${options},` : ''}
  });
} else {
  updateView(globalThis.view, annotations, normalizedStories${options ? `, ${options}` : ''});
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
