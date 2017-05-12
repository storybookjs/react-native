# Story Links Addon

The Story Links addon can be used to create links between stories. This addon works with both [React Storybook](https://github.com/kadirahq/react-storybook) and [React Native Storybook](https://github.com/kadirahq/react-native-storybook) (included by default).

## Getting Started

You can use this addon without installing it.

```js
import { storiesOf, linkTo } from '@kadira/storybook'

storiesOf('Button', module)
  .add('First', () => (
    <button onClick={linkTo('Button', 'Second')}>Go to "Second"</button>
  ))
  .add('Second', () => (
    <button onClick={linkTo('Button', 'First')}>Go to "First"</button>
  ));
```

Have a look at the linkTo function:

```js
linkTo('Toggle', 'off')
```

With that, you can link an event in a component to any story in the Storybook.

* First parameter is the the story kind name (what you named with `storiesOf`).
* Second parameter is the story name (what you named with `.add`).

> You can also pass a function instead for any of above parameter. That function accepts arguments emitted by the event and it should return a string. <br/>
> Have a look at [PR86](https://github.com/kadirahq/react-storybook/pull/86) for more information.
