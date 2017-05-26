---
id: 'custom-babel-config'
title: 'Custom Babel Config'
---

By default, Storybook loads your root `.babelrc` file and load those configurations.
But sometimes some of those options may cause Storybook to throw errors.

In that case, you can provide a custom `.babelrc` just for Storybook.
For that, simply create a file called `.babelrc` file inside the Storybook config directory (by default, it's `.storybook`).

Then Storybook will load the Babel configuration only from that file.

> Currently we do not support loading the Babel config from the package.json.
