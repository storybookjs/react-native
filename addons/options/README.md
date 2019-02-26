#NOTE: Options Addon is deprecated as of Storybook 5.0

Options are now configured using the [`options` parameter](../../docs/src/pages/configurations/options-parameter/index.md) which is built into Storybook.

- Global options: `addParameters({ options: { ... }})` and no addon is needed.
- Story options: `storiesOf(...).add('name', storyFn, { options: { ... }})`

See the [migration docs](../../MIGRATION.md#options-addon-deprecated) for what's changed.

# Storybook Options Addon

The Options addon can be used to (re-)configure the [Storybook](https://storybook.js.org) UI at runtime.

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](docs/screenshot.png)

## Getting Started

First, install the addon

```sh
yarn add @storybook/addon-options --dev
```

Add this line to your `addons.js` file (create this file inside your storybook config directory if needed).

```js
import '@storybook/addon-options/register';
```

### Set options globally

Import and use the `addParameters` + `options`-key in your `config.js` file.

```js
import { addParameters, configure } from '@storybook/react';

// Option defaults:
addParameters({
  options: {
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
    selectedPanel: undefined, // The order of addons in the "Addon panel" is the same as you import them in 'addons.js'. The first panel will be opened by default as you run Storybook
    /**
     * enable/disable shortcuts
     * @type {Boolean}
     */
    enableShortcuts: false, // true by default
  },
});

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

## TypeScript

To install type definitions: `yarn add @types/storybook__addon-options --dev`

Make sure you also have the type definitions installed for the following libs:

- Node
- React

You can install them using `yarn add @types/node @types/react --dev`, assuming you are using TypeScript >2.0.
