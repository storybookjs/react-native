---
id: 'theming'
title: 'Theming Storybook'
---

Storybook is theme-able! Just set a `theme` in the [options parameter](../options-parameter)!

## Global theming

It's really easy to theme Storybook globally.

We've created two basic themes that look good of the box: "normal" (a light theme) and "dark" (a dark theme).

As the simplest example example, you can tell Storybook to use the "dark" theme by modifyig `.storybook/config.js`:

```js
import { addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';

// Option defaults.
addParameters({
  options: {
    theme: themes.dark,
  },
});
```

When setting a theme, set a full theme object. The theme is replaced not combined.

## Dynamic theming

You can also theme dynamically based on the story you're viewing or based on UI in an addon (e.g. a theme picker).

For example, you can update the theme when the user is viewing a specific component:

```js
import { storiesOf } from '@storybook/react';
import yourTheme from './yourTheme';

storiesOf('MyComponent', module)
  .addParameters({ options: { theme: yourTheme } })
  .add(...)
});
```

Read on for more on how to create your own theme.

## Create a theme quickstart

The easiest way to customize Storybook is to generate a new theme using the `create()` function from `storybook/theming`. This function includes shorthands for the most common theme variables. Here's how to use it:

First create a new file in `.storybook` called `yourTheme.js`.

Next paste the code below and tweak the variables.

```ts
import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: 'hotpink',
  colorSecondary: 'deepskyblue',

  // UI
  appBg: 'white',
  appContentBg: 'silver',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: 'black',
  barBg: 'hotpink',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://placehold.it/350x150',
});
```

Finally, import your theme into `.storybook/config` and add it to your Storybook parameters.

```js
import yourTheme from './yourTheme';

addParameters({
  options: {
    theme: yourTheme,
  },
});
```

The `storybook/theming` package is built using TypeScript, so this should help create a valid theme for typescript users. The types are part of the package itself.

Many theme variables are optional, the `base` property is NOT. This is a perfectly valid theme:

```ts
import { create } from '@storybook/theming';

export default create({
  base: 'light',

  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://placehold.it/350x150',
});
```

## Addons and theme creation

Some addons require specific theme variables that a Storybook user must add. If you share your theme with the community make sure to support the official and other popular addons so your users have a consistent experience.

For example, the popular Actions addon uses [react-inspector](https://github.com/xyc/react-inspector/blob/master/src/styles/themes/chromeLight.js) which has themes of its own. Supply additional theme variables to style it like so:

```js
addonActionsTheme: {
  ...chromeLight,
  BASE_FONT_FAMILY: typography.fonts.mono,
  BASE_BACKGROUND_COLOR: 'transparent',
}
```

### Using the theme for addon authors

For a native Storybook experience, we encourage addon authors to reuse the theme variables above. The theming engine relies on [emotion](https://emotion.sh/), a CSS-in-JS library.

```js
import { styled } from '@storybook/theming';
```

Use the theme variables in object notation:

```js
const Component = styled.div(({ theme }) => ({
  background: theme.background.app,
  width: 0,
}));
```

Or with template literals:

```js
const Component = styled.div`
  background: `${props => props.theme.background.app}`
  width: 0;
`;
```
