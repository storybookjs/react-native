# Options Addon is deprecated as of Storybook 5.0

Global options can be specified with:

```js
import '@storybook/addon-roundtrip/register';
import '@storybook/addon-parameter/register';
import '@storybook/addon-preview-wrapper/register';

import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.dark,
  showNav: true,
  showPanel: true,
  panelPosition: 'bottom',
  enableShortcuts: true,
  isToolshown: true,
  selectedPanel: 'storybook/roundtrip',
});
```

Story specific options can be configured with: [`options` parameter](https://storybook.js.org/docs/configurations/options-parameter/) which is built into Storybook.

---

See the [migration docs](../../MIGRATION.md#options-addon-deprecated) for what's changed.
