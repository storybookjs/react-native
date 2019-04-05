const { babelify } = require('./compile-babel');

babelify({
  watch: true,
  silent: false,
  // eslint-disable-next-line no-console
  errorCallback: () => console.error('Failed to compile js'),
});
