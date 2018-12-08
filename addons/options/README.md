# Storybook Options Addon

The Options addon can be used to (re-)configure the [Storybook](https://storybook.js.org) UI at runtime.

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](docs/screenshot.png)

## Getting Started

First, install the addon

```sh
npm install -D @storybook/addon-options
```

Add this line to your `addons.js` file (create this file inside your storybook config directory if needed).

```js
import '@storybook/addon-options/register';
```

###Set options globally

Import and use the `withOptions` decorator in your `config.js` file.

```js
import { addDecorator, configure } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';

// Option defaults:
addDecorator(
  withOptions({
    /**
     * name to display in the top left corner
     * @type {String}
     */
    name: 'Storybook',
    /**
     * URL for name in top left corner to link to
     * @type {String}
     */
    url: '#',
    /**
     * show story component as full screen
     * @type {Boolean}
     */
    goFullScreen: false,
    /**
     * display panel that shows a list of stories
     * @type {Boolean}
     */
    showStoriesPanel: true,
    /**
     * display panel that shows addon configurations
     * @type {Boolean}
     */
    showAddonPanel: true,
    /**
     * display floating search box to search through stories
     * @type {Boolean}
     */
    showSearchBox: false,
    /**
     * show addon panel as a vertical panel on the right
     * @type {Boolean}
     */
    addonPanelInRight: false,
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
    hierarchySeparator: null,
    /**
     * regex for finding the hierarchy root separator
     * @example:
     *   null - turn off multiple hierarchy roots
     *   /\|/ - split by `|`
     * @type {Regex}
     */
    hierarchyRootSeparator: null,
    /**
     * sidebar tree animations
     * @type {Boolean}
     */
    sidebarAnimations: true,
    /**
     * id to select an addon panel
     * @type {String}
     */
    selectedAddonPanel: undefined, // The order of addons in the "Addon panel" is the same as you import them in 'addons.js'. The first panel will be opened by default as you run Storybook
    /**
     * enable/disable shortcuts
     * @type {Boolean}
     */
    enableShortcuts: false, // true by default
  })
);

configure(() => require('./stories'), module);
```

### Using per-story options

The options-addon accepts story parameters on the `options` key:

```js
import { storiesOf } from '@storybook/react';
import MyComponent from './my-component';

storiesOf('Addons|Custom options', module)
  // If you want to set the option for all stories in of this kind
  .addParameters({ options: { addonPanelInRight: true } })
  .add(
    'Story for MyComponent',
    () => <MyComponent />,
    // If you want to set the options for a specific story
    { options: { addonPanelInRight: false } }
  );
```

_NOTE_ that you must attach `withOptions` as a decorator (at the top-level) for this to work.

## Typescript

To install type definitions: `npm install -D @types/storybook__addon-options`

Make sure you also have the type definitions installed for the following libs:

- node
- react
 
You can install them using `npm install -D @types/node @types/react`, assuming you are using Typescript >2.0.
