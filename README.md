# Action Logger Addon

The Action Logger addon can be used to display data received by event handlers. This addon works with both [React Storybook](https://github.com/kadirahq/react-storybook) and [React Native Storybook](https://github.com/kadirahq/react-native-storybook) (included by default).

![](docs/screenshot.png)

## Getting Started

You can use this addon without installing it manually.

Import the `action` function and use it to create actions handlers. When creating action handlers, provide a name to make it easier to identify.

```js
import { storiesOf } from '@kadira/storybook'
import { action } from '@kadira/storybook-addon-actions'

storiesOf('Button', module)
  .add('default view', () => (
    <Button onClick={ action('button-click') }>
      Hello World!
    </Button>
  ))
```
