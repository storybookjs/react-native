---
id: 'theming'
title: 'Theming Storybook'
---

Storybook's manager UI is theme-able! You can change theme variables using [addon-options](https://github.com/storybooks/storybook/tree/master/addons/options).

## Set a theme

You can do this in an decorator, addon or in `.storybook/config.js`. Changing theme at runtime is supported!

First, create or modify `.storybook/addons.js` to include registering addon-options:  
```js
import '@storybook/addon-options/register';
```

Then, modify `.storybook/config.js` to include your new options:  
```js
import { addDecorator, configure } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';

addDecorator(
  withOptions({
    theme: {},
  })
);
```

When setting a theme, set a full theme object, the theme is replaced, not combined.

See more addon options at https://github.com/storybooks/storybook/tree/master/addons/options

## Get a theme

We have created 2 themes for you: "normal" (a light theme) and "dark" (a dark theme).

You can get these themes like so:

```js
import { addDecorator, configure } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { themes } from '@storybook/components';

// Option defaults.
addDecorator(
  withOptions({
    name: 'Foo',
    theme: themes.dark,
  })
);
```

## Theme variables

```
mainBackground: applied to root `background`, // 'linear-gradient(to bottom right, black, gray'
mainBorder: applied to panels `border`, // '1px solid rgba(0,0,0,0.1)'
mainBorderColor: applied for most borders, // 'rgba(0,0,0,0.1)'
mainBorderRadius: applied to panels, buttons, inputs // 4
mainFill: applied to panels `background`, // 'rgba(255,255,255,0.89)'
barFill: applied to TabsBar `background`, // 'rgba(255,255,255,1)'
inputFill: applied to Input `background`, // 'rgba(0,0,0,0.05)'
mainTextFace: applied to root `font-family`,
mainTextColor: applied to root & buttons & input `color`, // black
mainTextSize: applied to root, // 13
dimmedTextColor: applied in less important text, // 'rgba(0,0,0,0.4)'
highlightColor: applied to indicate selection, // '#9fdaff'
successColor: applied to indicate positive, // '#0edf62'
failColor: applied to indicate negative, // '#ff3f3f'
warnColor: applied to indicate ow-ow, // 'orange'
monoTextFace: applied to pre,
layoutMargin: applied to space panels, // 10
overlayBackground: applied to overlay `background`, // 'linear-gradient(to bottom right, rgba(233, 233, 233, 0.6), rgba(255, 255, 255, 0.8))'
```

### Deep theming components

All options above are single key options, in other words, they are variables, and their usage is fixed.

We will extend the theming ability in the future and possibly add more deep theming ability.
Right now we allow to deep theme: `stories nav panel`. Below are the varaiables that are used to deep theme `stories nav panel`.

storiesNav: deep theme for `stories nav`

```
storiesNav: {
  backgroundColor: 'aqua',
}
```

brand: deep theme for brand including `brand name` and `shortcuts`

```
brand: {
  background: 'url("/path/to/logo.svg")',
}
```

brandLink: deep theme for only `brand name`

```
brandLink: {
  border: 'none'
}
```

filter: deep theme for `stories filter section`

```
filter: {
  backgroundColor: 'red',
}
```

treeHeader: deep theme for `tree header`

```
treeHeader: {
  color: 'blue',
}
```

treeMenuHeader: deep theme for `tree menu header` of each menu

```
treeMenuHeader: {
  color: 'aqua',
}
```

menuLink: deep theme for `menu link` of each story

```
menuLink: {
  color: 'black',
}
```

activeMenuLink: deep theme for `active menu link` for the active story

```
activeMenuLink: {
  fontWeight: 'light',
}
```

treeArrow: deep theme for `tree arrow`. This accepts an object which receives `height`, `width`, `base` and `wrapper`

```
treeArrow: {
  height: 5,
  width: 5,
  base: {
    fontSize: '12px'
  },
  wrapper: {
    backgroundColor: 'white'
  }
}
```

The styles provided here support everything [emotion](https://emotion.sh/) does. So that included things like nested selectors!

## Adding more theme variables for addons

If addons have a need for specific theme variables, the user has to add them. 
We advise addons to reuse the variables listed above as much as possible.

Addon actions uses [react-inspector](https://github.com/xyc/react-inspector/blob/master/src/styles/themes/chromeLight.js) which has themes of it's own. If you want to theme it (our themes do) you can add needs the following additional theme variables:

```
addonActionsTheme: {
  ...chromeLight,
  BASE_FONT_FAMILY: monoFonts.fontFamily,
  BASE_BACKGROUND_COLOR: 'transparent',
}
```
