const { dirname } = require('path');

// These paths need to be aliased in the manager webpack config to ensure that all
// code running inside the manager uses the *same* version of react[-dom] that we use.
module.exports = {
  '@storybook/addons': dirname(require.resolve('@storybook/addons/package.json')),
  '@storybook/api': dirname(require.resolve('@storybook/api/package.json')),
  '@storybook/channels': dirname(require.resolve('@storybook/channels/package.json')),
  '@storybook/components': dirname(require.resolve('@storybook/components/package.json')),
  '@storybook/core-events': dirname(require.resolve('@storybook/core-events/package.json')),
  '@storybook/router': dirname(require.resolve('@storybook/router/package.json')),
  '@storybook/theming': dirname(require.resolve('@storybook/theming/package.json')),
  '@storybook/ui': dirname(require.resolve('@storybook/ui/package.json')),
  'core-js': dirname(require.resolve('core-js/package.json')),
  'prop-types': dirname(require.resolve('prop-types/package.json')),
  react: dirname(require.resolve('react/package.json')),
  'react-dom': dirname(require.resolve('react-dom/package.json')),
};
