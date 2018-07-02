// Building for distribution defaults to production target.
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Note: We are importing via CommonJS to be able to adjust NODE_ENV
// to production first before proceeding. This is required to correctly
// e.g. selecting the `.env` files to import. It also helps with all ESM
// imports which as some side-effect decide on things at "loadtime".
const server = require('@storybook/core/server');
server.buildStatic(require('./options').default);
