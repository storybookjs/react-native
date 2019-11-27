---
id: 'options-parameter'
title: 'Options Parameter'
---

Storybook UI is configurable using an options API that allows you to tweak its appearance globally and for each story.

> NOTE: If you've used older versions of Storybook this is formerly [addon-options](https://github.com/storybookjs/storybook/tree/next/addons/options), which has been deprecated.

### Global options

Import and use `addParameters` with the `options` key in your `config.js` file.

```js
import { addons } from '@storybook/addons';

addons.setConfig({
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
   * show story component as full screen	
   * @type {Boolean}	
   */	
  goFullScreen: false,	
  /**	
   * id to select an addon panel	
   * @type {String}	
   */	
  selectedPanel: undefined, // The order of addons in the "Addon panel" is the same as you import them in 'addons.js'. The first panel will be opened by default as you run Storybook	
});
```

For more information on configuring the `theme`, see [theming](../theming/).

### Per-story options

The options-addon accepts story parameters on the `options` key:

```js
import MyComponent from './my-component';

export default {
  title: 'Custom options',
  component: MyComponent,
};

export const story1 = () => <MyComponent />;
story1.story = {
  name: 'Story for MyComponent',
  parameters: { 
    // If you want to set the options for a specific story
    options: { panelPosition: 'right' },
  },
};
```
