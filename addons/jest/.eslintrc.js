module.exports = {
  "extends": ["airbnb", "prettier"],
  plugins: ["react"],
  rules: {
    "arrow-parens": ['error', 'as-needed'],
    "comma-dangle": [1, {
      "arrays": 'always-multiline',
      "objects": 'always-multiline',
      "imports": 'always-multiline',
      "exports": 'always-multiline',
      "functions": "ignore",
    }],
    "import/prefer-default-export": 0,
    "react/forbid-prop-types": 0,
    "react/no-danger": 0,
    "react/jsx-no-target-blank": 0,
    "react/require-default-props": 0,
    "import/no-extraneous-dependencies": 2,
    "react/jsx-filename-extension": 0,
    "jsx-a11y/href-no-hash": 0,
  },
  "env": {
    "browser": true,
    "es6": true,
    "commonjs": true,
    "node": true,
    "jest": true,
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        config: 'webpack-development.config.js'
      },
    },
  },
};

