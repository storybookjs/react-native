const { babelify } = require('./compile-js');

babelify({
  watch: true,
  silent: false,
  // eslint-disable-next-line no-console
  errorCallback: () => console.error('Failed to compile js'),
});
