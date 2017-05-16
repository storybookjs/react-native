## v.Next

- Deprecated `{ linkTo, action }` as built-in addons: https://github.com/storybooks/storybook/issues/1017. From 3.0 use them as you would [any other addon](https://storybooks.js.org/docs/react-storybook/addons/using-addons/).

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
import '@kadira/storybook-addon-actions/register'
import '@kadira/storybook-addon-links/register'

// *.stories.js
import { action } from '@kadira/storybook-addon-actions'
import { linkTo } from '@kadira/storybook-addon-links'
```
