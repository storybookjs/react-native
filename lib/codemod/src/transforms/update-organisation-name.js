// Demo at https://astexplorer.net/#/gist/f2d0b42c37e4556a4f816892be6ca402/latest
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const packageNames = {
    '@kadira/storybook-addons': '@storybook/addons',
    '@kadira/react-storybook-decorator-centered': '@storybook/addon-centered',
    '@kadira/storybook-addon-comments': '@storybook/addon-comments',
    '@kadira/storybook-addon-graphql': '@storybook/addon-graphql',
    '@kadira/storybook-addon-info': '@storybook/addon-info',
    '@kadira/storybook-addon-knobs': '@storybook/addon-knobs',
    '@kadira/storybook-addon-links': '@storybook/addon-links',
    '@kadira/storybook-addon-notes': '@storybook/addon-notes',
    '@kadira/storybook-addon-options': '@storybook/addon-options',
    storyshots: '@storybook/addon-storyshots',
    '@kadira/storybook-channels': '@storybook/channels',
    '@kadira/storybook-channel-postmsg': '@storybook/channel-postmessage',
    '@kadira/storybook-channel-websocket': '@storybook/channel-websocket',
    '@kadira/getstorybook': '@storybook/cli',
    '@kadira/react-storybook': '@storybook/react',
    '@kadira/react-native-storybook': '@storybook/react-native',
    '@kadira/storybook-ui': '@storybook/ui',
  };

  /**
   * Returns the name of the Storybook packages with the organisation name, 
   * replacing the old `@kadira/` prefix.
   * @param {string} oldPackageName the name of the old package
   * @return {string} the new package name
   * @example
   * // returns '@storybook/react'
   * getNewPackageName('@kadira/react-storybook')
   */
  const getNewPackageName = oldPackageName => {
    const packageNameWithOrganisation = packageNames[oldPackageName];

    return packageNameWithOrganisation;
  };

  /**
   * updatePackageName - updates the source name of the Storybook packages
   * @param {ImportDeclaration} declaration the import declaration
   * @returns {ImportDeclaration.Node} the import declaration node
   */
  const updatePackageName = declaration => {
    // eslint-disable-next-line no-param-reassign
    declaration.node.source.value = getNewPackageName(declaration.node.source.value);

    return declaration.node;
  };

  return j(file.source)
    .find(j.ImportDeclaration)
    .replaceWith(updatePackageName)
    .toSource({ quote: 'single' });
}
