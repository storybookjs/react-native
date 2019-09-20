---
id: 'env-vars'
title: 'Using Environment Variables'
---

Sometimes, we may use configuration items inside Storybook. It might be a theme color, some client secret, or a JSON string. So, we usually tend to hard code them.

But you can expose those configurations via "environment variables." For that, you need to prefix your environment variables with `STORYBOOK_` prefix.

For an example, let's expose two environment variables like this:

```sh
STORYBOOK_THEME=red STORYBOOK_DATA_KEY=12345 npm run storybook
```

Then we can access these environment variables anywhere inside our JS code like below:

```js
const out = console;

out.log(process.env.STORYBOOK_THEME);
out.log(process.env.STORYBOOK_DATA_KEY);
```

> Even though we can access these env variables anywhere in the client side JS code, it's better to use them only inside stories and inside the main Storybook config file.

## Usage in custom head/body

These environment variables can be used in [custom head](/configurations/add-custom-head-tags] and [custom body](/configurations/add-custom-body) files.

Storybook will replace percent-delimited variable names with their values; e.g. `%STORYBOOK_THEME%` will become `red`.

> If using the environment variables as attributes or values in JavaScript, you may need to add quotes, as the value will be inserted directly. e.g. `<link rel="stylesheet" href="%STORYBOOK_STYLE_URL%" />`

## Build time environment variables

You can also pass these environment variables when you are [building your storybook](/basics/exporting-storybook) with `build-storybook`.

Then they'll be hard coded to the static version of your Storybook.

## NODE_ENV env variable

In addition to the above prefixed environment variables, you can also pass the NODE_ENV variable to Storybook. But, you normally don't need to do that since we set a reasonable default value for it.

-   When running `npm run storybook`, we set NODE_ENV to 'development'
-   When building storybook, we set NODE_ENV to 'production'
