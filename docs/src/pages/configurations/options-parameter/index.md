---
id: 'options-parameter'
title: 'Options Parameter'
---

Storybook UI is configurable using an options API that allows you to tweak its appearance globally and for each story.

### Global options

Import and use `setConfig` in your `manager.js` file.

```js
import { addons } from '@storybook/addons';

addons.setConfig({
  /**
   * show story component as full screen
   * @type {Boolean}
   */
  isFullscreen: false,

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
   * @type {('bottom'|'right')}
   */
  panelPosition: 'bottom',

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
   * show/hide tool bar
   * @type {Boolean}
   */
  isToolshown: true,

  /**
   * theme storybook, see link below
   */
  theme: undefined,

  /**	
   * id to select an addon panel	
   * @type {String}	
   */	
  selectedPanel: undefined,
});
```

### showRoots

Import and use `addParameters` with the `options` key in your `preview.js` file.

```js
import { addParameters } from '@storybook/react';

addParameters({
  options: {
    /**
     * display the top-level grouping as a "root" in the sidebar
     * @type {Boolean}
     */
    showRoots: false,
  },
});
```

### Sorting stories

Import and use `addParameters` with the `options` key in your `preview.js` file.

```js
import { addParameters } from '@storybook/react';

addParameters({
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
});
```

For more information on configuring the `theme`, see [theming](../theming/).

### Per-story options

The options-addon accepts story parameters on the `options` key:

```js
import MyComponent from './my-component';

export default {
  title: 'Options',
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};
```
