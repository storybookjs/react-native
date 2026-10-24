// `useStyle` memoizes in the real package; recomputing is enough here.
module.exports = {
  IconButton: 'IconButton',
  useStyle: (styleFactory) => styleFactory(),
};
