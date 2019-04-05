const { dirname } = require('path');

// These paths need to be aliased in the manager webpack config to ensure that all
// code running inside the manager uses the *same* versions of each package.
module.exports = {
  '@emotion/core': dirname(require.resolve('@emotion/core/package.json')),
  '@emotion/styled': dirname(require.resolve('@emotion/styled/package.json')),
  'emotion-theming': dirname(require.resolve('emotion-theming/package.json')),
};
