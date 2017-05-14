// Demo at https://astexplorer.net/#/gist/f2d0b42c37e4556a4f816892be6ca402/latest
export default function transformer(file, api) {
  const j = api.jscodeshift;

  /**
   * Checks whether the node value matches a Storybook package
   * @param {ImportDeclaration.Node} the import declaration node
   * @returns {boolean} whether the node value matches a Storybook package
   */
  const isStorybookPackage = node => node.value.source.value.includes('@kadira');

  /**
   * Returns the name of the Storybook packages with the organisation name, 
   * replacing the old `@storybook/` prefix.
   * @param {string} oldPackageName the name of the old package
   * @return {string} the new package name
   * @example
   * // returns '@storybook/react'
   * getNewPackageName('@storybook/react')
   */
  const getNewPackageName = oldPackageName => {
    const packageNameWithoutPrefix = oldPackageName.slice(7);
    const packageNameWithOrganisation = `@storybook${packageNameWithoutPrefix}`;

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
    .filter(isStorybookPackage)
    .replaceWith(updatePackageName)
    .toSource({ quote: 'single' });
}
