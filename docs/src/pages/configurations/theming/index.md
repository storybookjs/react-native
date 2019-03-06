---
id: 'theming'
title: 'Theming Storybook'
---

Storybook is theme-able! You can change theme variables using the [options parameter](../options-parameter).

## Set a theme

You can do this in an decorator, addon or in `.storybook/config.js`. Changing theme at runtime is supported!

Just modify `.storybook/config.js` to include your new options:

```js
import { addParameters, configure } from '@storybook/react';

addParameters({
  options: {
    theme: {},
  },
});
```

When setting a theme, set a full theme object, the theme is replaced, not combined.

See more addon options at https://github.com/storybooks/storybook/tree/master/addons/options

## Get a theme

We have created 2 themes for you: "normal" (a light theme) and "dark" (a dark theme).

You can get these themes like so:

```js
import { addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';

// Option defaults.
addParameters({
  options: {
    name: 'Foo',
    theme: themes.dark,
  },
});
```

## Create a theme quickstart

The easiest way to customize Storybook to generate a new theme using `create()`. This function includes shorthands for the most common theme variables. Here's how to use it.

First create a new file in `.storybook` called `yourTheme.js`.

Next paste the code below and tweak the variables.

```
import { create } from '@storybook/theming';

export default create({
  // Is this a 'light' or 'dark' theme?
  base: 'light',

  // Color palette
  colorPrimary: 'red', // primary color
  colorSecondary: 'pink', // secondary color

  // UI
  appBg: 'papayawhip',
  appContentBg: 'white',
  appBorderColor: 'rgba(0,0,0,.1)',
  appBorderRadius: 4,

  // Fonts
  fontBase: '"Helvetica", Arial, sans-serif',
  fontCode: 'Monaco, monospace',

  // Text colors
  textColor: '#FFFFFF',
  textInverseColor: '#333333',

  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: 'blue',
  barBg: 'white',

  // Form colors
  inputBg: 'white',
  inputBorder: 'rgba(0,0,0,.1)',
  inputTextColor: '#333333',
  inputBorderRadius: 4,

  // Brand logo/text
  brand: `<svg .../>`,
});
```

Finally, import your theme into `.storybook/config` and add it to your Storybook parameters.

```
import {yourTheme} from './yourTheme';

addParameters({
  options: {
    theme: yourTheme,
  },
});
```

## Addons and theme creation

Some addons require specific theme variables that a Storybook user must add. If you share your theme with the community make sure to support the official and other popular addons so your users have a consistent experience.

For example, the popular Actions addon uses [react-inspector](https://github.com/xyc/react-inspector/blob/master/src/styles/themes/chromeLight.js) which has themes of it's own. Supply additional theme variables to style it like so:

```
addonActionsTheme: {
  ...chromeLight,
  BASE_FONT_FAMILY: typography.fonts.mono,
  BASE_BACKGROUND_COLOR: 'transparent',
}
```

### Using the theme for addon authors

For a native Storybook experience, we encourage addon authors to reuse the theme variables above. The theming engine relies on [emotion](https://emotion.sh/), a CSS-in-JS library.

```
import { styled } from '@storybook/theming';
```

Use the theme variables in object notation:

```
const Component = styled.div(
  ({ theme }) => ({
    background: theme.background.app,
    width: 0,
  }),
);
```

Or with styled-components template literals:

```
const Component = styled.div`
  background: `${props => props.theme.background.app}`
  width: 0;
`;
```

### Advanced theming

For further customization adjust theme variables manually.

This is the master list:

```
base: 'light' | 'dark',
color: {
  primary
  secondary
  tertiary
  ancillary

  orange
  gold
  green
  seafoam
  purple
  ultraviolet

  lightest
  lighter
  light
  mediumlight
  medium
  mediumdark
  dark
  darker
  darkest

  border

  positive
  negative
  warning

  defaultText
  inverseText
}
background: {
  app
  content
  hoverable

  positive
  negative
  warning
}
typography: {
  fonts: {
    base
    mono
  }
  weight: {
    regular
    bold
    black
  }
  size: {
    s1
    s2
    s3
    m1
    m2
    m3
    l1
    l2
    l3
    code
  }
  input: {
    border
    background
    color
    borderRadius
  };

  layoutMargin
  appBorderColor
  appBorderRadius

  barTextColor
  barSelectedColor
  barBg

  brand
}
TODO finish this, what's the best way to document?
```
