---
id: 'faq'
title: 'Frequently Asked Questions'
---

Here are some answers to frequently asked questions. If you have a question, you can ask it by opening an issue on the [Storybook Repository](https://github.com/storybooks/storybook/).

### How can I run coverage tests with Create React App and leave out stories?

Create React App does not allow providing options to Jest in your `package.json`, however you can run `jest` with commandline arguments:

```sh
npm test -- --coverage --collectCoverageFrom='["src/**/*.{js,jsx}","!src/**/stories/*"]'
```

### I see `ReferenceError: React is not defined` when using storybooks with Next.js

Next automatically defines `React` for all of your files via a babel plugin. You must define `React` for JSX to work. You can solve this either by:

1.  Adding `import React from 'react'` to your component files.
2.  Adding a `.babelrc` that includes [`babel-plugin-react-require`](https://www.npmjs.com/package/babel-plugin-react-require)

### How do I setup Storybook to share Webpack configuration with Next.js?

You can generally reuse webpack rules fairly easily by placing them in a file that is `require()`-ed from both your `next.config.js` and your `.storybook/webpack.config.js` files. For example, [this gist](https://gist.github.com/metasean/cadd2becd60cc3b295bf49895a56f9b4) sets both next.js and storybook up with global stylesheets.
