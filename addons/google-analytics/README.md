# Storybook Addon Google Analytics

Storybook Addon Google Analytics can be used to support google analytics in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

## Getting Started

Install:

```sh
yarn add @storybook/addon-google-analytics --dev
```

Then, add following content to `.storybook/addons.js`

```js
import '@storybook/addon-google-analytics/register';
```

Then, set an environment variable

```
window.STORYBOOK_GA_ID = UA-000000-01
```
