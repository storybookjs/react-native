## v.Next

-   Deprecated `{ linkTo, action }` as built-in addons: <https://github.com/storybookjs/storybook/issues/1017>. From 3.0 use them as you would [any other addon](https://storybook.js.org/addons/using-addons/).

Before:

```js
// .storybook/addons.js
import '@kadira/storybook/addons'

// *.stories.js
import { linkTo, action } from '@kadira/storybook'
```

After:

```js
// .storybook/addons.js
import '@storybook/addon-actions/register'
import '@storybook/addon-links/register'

// *.stories.js
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
```
