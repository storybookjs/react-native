---
id: 'custom-postcss-config'
title: 'Custom Postcss Config'
---

Storybook can load your custom postcss configuration. 

It searches for the first postcss config file in the parents directories of your loaded file : 
- `.postcssrc`
- `.postcssrc.json`
- `.postcssrc.yml`
- `.postcssrc.js`
- `postcss.config.js`

If no postcss config file is found, it applies a default configuration which is : 

```js
{
    ident: 'postcss',
    postcss: {},
    plugins: () => [
        require('postcss-flexbugs-fixes'),
        autoprefixer({
            flexbox: 'no-2009',
        }),
    ],
}
```

> Currently we do **not** support loading the Babel config from the `package.json` neither in the Storybook config directory (by default, it's `.storybook`).
