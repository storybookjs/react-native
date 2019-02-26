---
id: 'options-parameter'
title: 'Options Parameter'
---

Storybook UI is configurable using an options API that allows you to tweak its appearance globally and for each story.

> NOTE: If you've used older versions of Storybook this is formerly [addon-options](https://github.com/storybooks/storybook/tree/next/addons/options), which has been deprecated.

### Global options

Import and use `addParameters` with the `options` key in your `config.js` file.

```js
import { addParameters, configure } from '@storybook/react';

// Option defaults:
addParameters({
  options: {
    /**
     * show story component as full screen
     * @type {Boolean}
     */
    isFullScreen: false,
    /**
     * display panel that shows a list of stories
     * @type {Boolean}
     */
    showNav: true,
    /**
     * display panel that shows addon configurations
     * @type {Boolean}
     */
    showPanel: true,
    /**
     * where to show the addon panel
     * @type {String}
     */
    panelPosition: 'bottom',
    /**
     * sorts stories
     * @type {Boolean}
     */
    sortStoriesByKind: false,
    /**
     * regex for finding the hierarchy separator
     * @example:
     *   null - turn off hierarchy
     *   /\// - split by `/`
     *   /\./ - split by `.`
     *   /\/|\./ - split by `/` or `.`
     * @type {Regex}
     */
    hierarchySeparator: /\/|\./,
    /**
     * regex for finding the hierarchy root separator
     * @example:
     *   null - turn off multiple hierarchy roots
     *   /\|/ - split by `|`
     * @type {Regex}
     */
    hierarchyRootSeparator: /\|/,
    /**
     * sidebar tree animations
     * @type {Boolean}
     */
    sidebarAnimations: true,
    /**
     * enable/disable shortcuts
     * @type {Boolean}
     */
    enableShortcuts: true,
    /**
     * theme storybook, see link below
     */
    theme: undefined,
  },
});
```

For more information on configuring the `theme`, see [theming](../theming/).

### Per-story options

The options-addon accepts story parameters on the `options` key:

```js
import { storiesOf } from '@storybook/react';
import MyComponent from './my-component';

storiesOf('Addons|Custom options', module)
  // If you want to set the option for all stories in of this kind
  .addParameters({ options: { panelPosition: 'bottom' } })
  .add(
    'Story for MyComponent',
    () => <MyComponent />,
    // If you want to set the options for a specific story
    { options: { panelPosition: 'right' } }
  );
```
