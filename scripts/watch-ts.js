const { tscfy } = require('./compile-ts');

tscfy({
  watch: true,
  silent: false,
  // eslint-disable-next-line no-console
  errorCallback: () => console.error('Failed to compile ts'),
});
