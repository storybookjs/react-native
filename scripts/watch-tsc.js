const { tscfy } = require('./compile-tsc');

tscfy({
  watch: true,
  silent: false,
  // eslint-disable-next-line no-console
  errorCallback: () => console.error('Failed to compile ts'),
});
