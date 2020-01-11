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
   * display the top-level grouping as a "root" in the sidebar
   * @type {Boolean}
   */
  showRoots: false,

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

### Sorting stories

By default, stories are sorted in the order in which they were imported. This can be overridden by adding `storySort` to the `options` parameters in your `preview.js` file.

The most powerful method of sorting is to provide a function to `storySort`. Any custom sorting can be achieved with this method.

```js
import { addParameters, configure } from '@storybook/react';

addParameters({
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
});
```

The `storySort` can also accept a configuration object.

```js
import { addParameters, configure } from '@storybook/react';

addParameters({
  options: {
    storySort: {
      method: 'alphabetical', // Optional, defaults to 'configure'.
      sort: ['Intro', 'Components'], // Optional, defaults to [].
      locales: 'en-US', // Optional, defaults to system locale.
    },
  },
});
```

To sort your stories alphabetically, set `method` to `'alphabetical'` and optionally set the `locales` string. To sort your stories using a custom list, use the `sort` array; stories that don't match an item in the `sort` list will appear after the items in the list. 2nd

The `sort` array can accept a nested array in order to sort 2nd-level story kinds. For example:

```js
import { addParameters, configure } from '@storybook/react';

addParameters({
  options: {
    storySort: {
      sort: [
        'Intro',
        'Pages',
        [
          'Home',
          'Login',
          'Admin',
        ],
        'Components',
      ],
    },
  },
});
```

Which would result in this story ordering:

1. `Intro` and then `Intro/*` stories
2. `Pages` story
3. `Pages/Home` and `Pages/Home/*` stories
4. `Pages/Login` and `Pages/Login/*` stories
5. `Pages/Admin` and `Pages/Admin/*` stories
6. `Pages/*` stories
7. `Components` and `Components/*` stories
8. All other stories

Note that the `order` option is independent of the `method` option; stories are sorted first by the `order` array and then by either the `method: 'alphabetical'` or the default `configure()` import order.

### Theming

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
