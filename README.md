# Story Links Addon

The Story Links addon can be used to create links between stories. This addon works with both [React Storybook](https://github.com/kadirahq/react-storybook) and [React Native Storybook](https://github.com/kadirahq/react-native-storybook) (included by default).

To create a link, import the `linkTo`function and use it to create links. When creating links, provide the target story info.

```js
import { storiesOf } from '@kadira/storybook'
import { linkTo } from '@kadira/storybook-addon-links'

storiesOf('Button', module)
  .add('default view', () => (
    <Button onClick={ linkTo('Button', 'my target') }>
      Next Story
    </Button>
  ))
  .add('my-target' , () => (
    <Button>Hello World!</Button>
  ))
```
