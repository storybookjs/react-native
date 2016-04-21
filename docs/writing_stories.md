# Writing Stories

## TOC

* [Basic API](#basic-api)
* [Creating Actions](#creating-actions)
* [Using Decorators](#using-decorators)
* [Linking Stories](#linking-stories)

You need to write stories to show your components inside React Storybook. We've a set of APIs allows you to write stories and do more with them:

## Basic API

This is how you can create stories:

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';

storiesOf('Button', module)
  .add('with a text', () => (
    <button>My First Button</button>
  ))
  .add('with no text', () => (
    <button></button>
  ));
```

When you are writing stories, you can follow these guidelines to write great stories.

* Write UI components by passing data via props. In this way, you can isolate UI components easily. (Maybe you can follow a pattern like [Mantra](https://voice.kadira.io/sneak-peek-mantra-7161624acaa7).)
* Do not write app-specific code inside your UI components.
* Write your stories close to your UI components. A directory called `stories` inside your components directory is a good idea.
* In Meteor, you may need to use a directory name with `.stories` or create it inside the `tests` directory. Otherwise, these story files will be loaded by Meteor.
* In a single story module, create stories for a single component.
* Prefix story names with a dot (`.`). For example:

```js
storiesOf('core.Button', module)
```

## Creating Actions

Usually our components accept event handlers. Actions help us to debug those event handlers. These actions are logged in the `Action Logger` info window in React Storybook.

This is how we can create an action:

```js
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Button', module)
  .add('with a text', () => (
    <button onClick={action('click the button')}>My First Button</button>
  ));
```

Here we create an action named `click the button`. It gives a function to the `onClick` prop in our button.

Then, when you click on the button, it will log something like this into the Action Logger:

```js
{
  "name": "click the button",
  "args": [
    "[SyntheticEvent]",
    ".1",
    {
      "isTrusted": false
    }
  ]
}
```

Here we can see the name we've mentioned when creating the action. After that, we can see the arguments passed to the `onClick` event handler. In this case, we've three arguments. `[SyntheticEvent]` is the actual event object passed by React and you can use that to get more details.

> For simplicity, React Storybook does not show the actual object. Instead it will show `[SyntheticEvent]`.

## Using Decorators

In some apps, we need to wrap our components with a given context. Most of the time, you have to do this when you are using Material UI or Radium.

So, you need to write your stories like this:

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Theme from '../theme';
import MyComponent from '../my_component';

storiesOf('MyComponent', modules)
  .add('without props', () => (
    <Theme>
      <MyComponent />
    </Theme>
  ))
  .add('with some props', () => (
    <Theme>
      <MyComponent name="Arunoda"/>
    </Theme>
  ));
```

As you can see, you always need to wrap your components with the `Theme` component. But, there's a much better way. See following example with a decorator:

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Theme from '../theme';
import MyComponent from '../my_component';

storiesOf('MyComponent', modules)
  .addDecorator((story) => (
    <Theme>
      {story()}
    </Theme>
  ))
  .add('without props', () => (<MyComponent />))
  .add('with some props', () => (<MyComponent name="Arunoda"/>));
```

You can add as many as decorators you want, but make sure to call `.addDecorator()` before you call `.add()`.

## Linking Stories

Sometimes, we may need to link stories. With that, we could use Storybook as a prototype builder. (like [InVision](https://www.invisionapp.com/), [Framer.js](http://framerjs.com/)). Here's how to do that.

Let's say, we've a Toggle button and we need to change the story as we click the button. This is how we do it:

```js
import { linkTo } from @kadira/storybook

storiesOf('Toggle', module)
  .add('on', () => {
    return <Toggle value={true} onChange={linkTo('Toggle', 'off')} />
  })
  .add('off', () => {
    return <Toggle value={false} onChange={linkTo('Toggle', 'on')} />
  });
```

Have a look at the `linkTo` function:

```js
linkTo('Toggle', 'off')
```

With that, you can link an event prop to any story in the Storybook.

* First parameter is the the story kind name (what you named with `storiesOf`).
* Second parameter is the story name (what you named with `.add`).

> You can also pass a function instead for any of above parameter. That function accepts arguments emitted by the event and it should return a string.

Have a look at [PR86](https://github.com/kadirahq/react-storybook/pull/86) for more information.
