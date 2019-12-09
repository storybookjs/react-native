const projectTypes = {
  UNDETECTED: 'UNDETECTED',
  REACT_SCRIPTS: 'REACT_SCRIPTS',
  METEOR: 'METEOR',
  REACT: 'REACT',
  REACT_NATIVE: 'REACT_NATIVE',
  REACT_PROJECT: 'REACT_PROJECT',
  WEBPACK_REACT: 'WEBPACK_REACT',
  VUE: 'VUE',
  SFC_VUE: 'SFC_VUE',
  ANGULAR: 'ANGULAR',
  EMBER: 'EMBER',
  ALREADY_HAS_STORYBOOK: 'ALREADY_HAS_STORYBOOK',
  UPDATE_PACKAGE_ORGANIZATIONS: 'UPDATE_PACKAGE_ORGANIZATIONS',
  POLYMER: 'POLYMER',
  WEB_COMPONENTS: 'WEB_COMPONENTS',
  MITHRIL: 'MITHRIL',
  MARKO: 'MARKO',
  HTML: 'HTML',
  RIOT: 'RIOT',
  PREACT: 'PREACT',
  SVELTE: 'SVELTE',
  RAX: 'RAX',
};

export default projectTypes;

export const supportedFrameworks = [
  'react',
  'react-native',
  'vue',
  'angular',
  'polymer',
  'mithril',
  'riot',
  'ember',
  'marko',
  'meteor',
  'preact',
  'svelte',
  'rax',
];

const notInstallableProjectTypes = [
  projectTypes.UNDETECTED,
  projectTypes.ALREADY_HAS_STORYBOOK,
  projectTypes.UPDATE_PACKAGE_ORGANIZATIONS,
];

export const installableProjectTypes = Object.values(projectTypes)
  .filter(type => !notInstallableProjectTypes.includes(type))
  .map(type => type.toLowerCase());
