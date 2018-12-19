const { dirname } = require('path');

// These paths need to be aliased in the manager webpack config to ensure that all
// code running inside the manager uses the *same* version of react[-dom] that we use.
module.exports = {
  react: dirname(require.resolve('react/package.json')),
  'react-dom': dirname(require.resolve('react-dom/package.json')),
};
