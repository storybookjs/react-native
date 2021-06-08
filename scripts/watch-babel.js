const { babelify } = require('./compile-babel');

babelify({
  watch: true,
  silent: false,
  errorCallback: () => console.error('Failed to compile js'),
});
