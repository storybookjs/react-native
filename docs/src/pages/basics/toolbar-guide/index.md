---
id: 'toolbar-guide'
title: 'Toolbar'
---

Storybook comes with a toolbar which is displayed by default as part of the layout with a default height of `40px`.

The user can toggle whether to hide or display the toolbar. It is on display by default and set on the canvas tab. This feature can be toggled as one of the [Global options](https://storybook.js.org/docs/configurations/options-parameter/).

To hide or display the toolbar, the user should toggle the `isToolshown` key in `config.js`,

```jsx
addParameter({
  options: {
    /**
     * show/hide tool bar
     * @type {Boolean}
     */
    isToolshown: true,
  },
});
```

The toolbar is not an addon but provides easy access to them. Both Canvas and docs are tabs within the toolbar. While on the canvas tab users have access to the following default features:

- Zoom-in, zoom-out, and reset-zoom on the preview
- Change the background of the preview
- Adjust for color blindness emulation
- Make the preview full screen
- Open the canvas in a new tab
- Copy canvas link

On the other hand, the [DocsPage](https://github.com/storybookjs/storybook/tree/master/addons/docs#docspage) is also not an addon but the successor to addon-info. The user has access to the DocsPage when `Docs` is installed. It is added to the toolbar by default with zero config required.

A user can [write custom addons](https://storybook.js.org/docs/addons/writing-addons/) and add them to the toolbar. This can be achieved by modifying a the value for `type` when registering an addon.

For an addon to be displayed in the toolbar, the user must add the `TAB` type to the addon. The user must also add the `route` and `match` key/value pairs.

```jsx
import React from 'react';
import { addons, types } from '@storybook/addons';

const ADDON_ID = 'myaddon';
const PARAM_KEY = 'myAddon';
const PANEL_ID = `${ADDON_ID}/tab`;

addons.register(ADDON_ID, api => {
  const render = ({ active, key }) => (
    <div>
      <SomeComponent />
    </div>
  );
  const title = 'My Addon';

  addons.add(PANEL_ID, {
    type: types.TAB,
    route: ({ storyId }) => `/info/${storyId}`,
    match: ({ viewMode }) => viewMode === 'info',
    title,
    render,
  });
});
```
