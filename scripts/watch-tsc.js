const { tscfy } = require('./compile-tsc');

tscfy({
  watch: true,
  silent: false,
  errorCallback: () => console.error('Failed to compile ts'),
});
