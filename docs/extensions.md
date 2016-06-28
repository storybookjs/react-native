# React Storybook Extensions

React Storybook comes with an extensions API to customize the storybook experience. Let's have a look at them.

## TOC

* [API](#api)
  * [Decorators](#decorators)
  * [Addons](#addons)
* [Available Extensions](#available-extensions)

## API

### Decorators

A decorator is a way to wrap an story with a common set of component(s). Let's say you want to center all your stories. Then this is how we can do it with a decorator:

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import MyComponent from '../my_component';

storiesOf('MyComponent', module)
  .addDecorator((story) => (
    <div style={{textAlign: 'center'}}>
      {story()}
    </div>
  ))
  .add('without props', () => (<MyComponent />))
  .add('with some props', () => (<MyComponent text="The Comp"/>));
```

Here we only add the decorator for the current set of stories for a given story kind.

But, you can add a decorator **globally** and it'll be applied to all the stories you create. This is how to add a decorator like that.

```js
import { configure, addDecorator } from '@kadira/storybook';

addDecorator((story) => (
  <div style={{textAlign: 'center'}}>
    {story()}
  </div>
));

configure(function () {
  ...
}, module);
```

### Addons

With an addon, you can introduce new methods to the story creation API. For an example, you can achieve the above centered component functionality with an addon like this:

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import MyComponent from '../my_component';

storiesOf('MyComponent', module)
  .addWithCentered('without props', () => (<MyComponent />))
  .addWithCentered('with some props', () => (<MyComponent text="The Comp"/>));
```
Here we are using a new API called `addWithCentered`. That's introduce by an addon.

This is how we set that addon.

```js
import { configure, setAddon } from '@kadira/storybook';

setAddon({
  addWithCentered(storyName, storyFn) {
    // You can access the .add and other API added by addons in here.
    this.add(storyName, (context) => (
      <div style={{textAlign: "center"}}>
        {storyFn(context)}
      </div>
    ));
  }
});

configure(function () {
  ...
}, module);
```

## Available Extensions

Rather than creating extensions yourself, you can use extensions available below:

* [Centered Decorator](https://github.com/kadirahq/react-storybook-decorator-centered)
* [Info addon for displaying propTypes, source and more info](https://github.com/kadirahq/react-storybook-addon-info)
* [Create Groups of stories, display all of them togheter](https://github.com/jurgob/react-storybook-addon-add-stories-group)

> Feel free to include your extension to the above list and share it with other. <br/>
> Just make it available on NPM (and GitHub) and send a PR to this page.
