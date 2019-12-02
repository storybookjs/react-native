---
id: 'introduction'
title: 'Intro to Addons'
---

By default, Storybook comes with a way to list stories and visualize them. Addons implement extra features for Storybooks to make them more useful.

Basically, there are two types of addons. (Decorators and Native Addons)

## 1. Decorators

Decorators are wrapper components or Storybook decorators that wrap a story.

### Wrapper Components

For example, let's say we want to center a story rendered on the screen. For that, we can use a wrapper component like this:

```js
const styles = {
  textAlign: 'center',
};
const Center = ({ children }) => <div style={styles}>{children}</div>;
```

Then we can use it when writing stories.

```js
import Center from './center';
import Button from './button';

export default {
  title: 'Button',
};

export const defaultView = () => (
  <Center>
    <Button>Hello Button</Button>
  </Center>
);
```

### Storybook Decorators

You can also expose this functionality as a Storybook decorator and use it like this:

```js
import Button from './button';
import Center from './center';

export default {
  title: 'Button',
  decorators: [storyFn => <Center>{storyFn()}</Center>],
};

export const defaultView = () => (
  <Button>Hello Button</Button>
);
```

You can also add a decorator globally for all stories like this:

in `.storybook/preview.js`:

```js
import { addDecorator } from '@storybook/react';
import Center from './center';

addDecorator(storyFn => <Center>{storyFn()}</Center>);
```

## 2. Native Addons

Native addons use Storybook as a platform and interact with it. Native addons can add extra features beyond wrapping stories.

For example, [storybook-actions](https://github.com/storybookjs/storybook/tree/master/addons/actions) is such an addon.

![Demo of Storybook Addon Actions](../static/addon-actions-demo.gif)

It will allow you to inspect the parameters of any event of your components.

See the following links to learn more about native addons:

- [Using addons](/addons/using-addons)
- [Addon gallery](https://storybook.js.org/addons/)
- [Write your own addon](/addons/writing-addons)
