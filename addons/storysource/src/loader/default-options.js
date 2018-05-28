const defaultOptions = {
  prettierConfig: {
    printWidth: 120,
    tabWidth: 2,
    bracketSpacing: true,
    trailingComma: 'es5',
    singleQuote: true,
    parser: 'babylon',
  },
  uglyCommentsRegex: [/^eslint-.*/, /^global.*/],
};

export default defaultOptions;
