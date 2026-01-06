let registered = false;
function interopRequireDefault(filePath) {
  const hasEsbuildBeenRegistered = !!require('module')._extensions['.ts'];

  if (registered === false && !hasEsbuildBeenRegistered) {
    const { register } = require('esbuild-register/dist/node');
    registered = true;
    register({
      target: `node${process.version.slice(1)}`,
      format: 'cjs',
      hookIgnoreNodeModules: true,
      // Some frameworks, like Stylus, rely on the 'name' property of classes or functions
      // https://github.com/storybookjs/storybook/issues/19049
      keepNames: true,
      tsconfigRaw: `{
      "compilerOptions": {
        "strict": false,
        "skipLibCheck": true,
      },
    }`,
    });
  }

  const result = require(filePath);

  const isES6DefaultExported =
    typeof result === 'object' && result !== null && typeof result.default !== 'undefined';

  return isES6DefaultExported ? result.default : result;
}

module.exports = { interopRequireDefault };
