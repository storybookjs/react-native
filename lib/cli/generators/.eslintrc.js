const ignore = 0;

module.exports = {
  overrides: [
    {
      files: '*/template[-?]*/**',
      env: {
        browser: true,
      },
      rules: {
        'react/no-this-in-sfc': ignore,
        'import/no-unresolved': ignore,
        'import/no-extraneous-dependencies': ignore,
        'global-require': ignore,
        'react/react-in-jsx-scope': ignore,
      },
    },
    {
      files: 'REACT_NATIVE/template/**',
      env: {
        browser: false,
      },
    },
  ],
};
