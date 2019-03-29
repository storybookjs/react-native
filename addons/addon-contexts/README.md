# Storybook Addon Contexts

**Storybook Addon Contexts** is an addon for driving your components under dynamic contexts in Storybook.


## Why you need this?
Real world users expects your application being customizable, that is why often your components are **polymorphic**:
they simply need to adapt themselves under different contextual environments.  Imagine your components can speak
Chinese, English, or even French, and they change their skin tone under dark or light theme.  Yeah, you want to make
sure they all looks great in any circumstance.

Often enough, you will find it become very tedious wrapping a component deeply nested before you actually write your
main content of story.  You even start to write wrapper components or factory functions just to make your life easier.
How about changing the context of your story dynamically?!  There were simply have no good way so you ended up writing
stories like an accountant.

That is why you need this.  An elegant way to wrap your component stories and change their contextual environment
directly and dynamically in Storybook UI!  Kind of like a dependency injection, eh!  The best bit is **define it once
and apply everywhere**.


## Getting started

To start, add this package into your project:

```bash
yarn add -D
```

Then, register the addon by adding the following line into your `addon.js` file (you should be able to find the file
under the storybook config directory of your project):

```js
import '[addon-contexts]/register';
```

(In React) It is recommended to use this addon globally in your storybook, add the following lines into `config.js`
file (you usually see this file peer to `addon.js` file):

```js
import { addDecorator } from '@storybook/react';
import { withContexts } from '[addon-contexts]';
import { contexts } from './configs/contexts'; // you will need to creat this addon-context config file later

addDecorator(withContexts(contexts));

...
```

Alternatively, just like other addons, you can also just use this addon for a given set of stories:

```js
import { storiesOf } from '@storybook/react';
import { withContexts } from '[addon-contexts]';

const stories = storiesOf('Storybook Knobs', module);

stories.addDecorator(withKnobs(options));

...
```

## Configurations

It is recommended to have a separate file for managing addon configuration assets.  Let's add a file named
`context.js` and export the setting object `context`:

```js
// @context.js (example)

export const contexts = [
  {
    icon: 'box',                                            // <- icon for displaying in the Storybook manager toolbar
    title: 'Themes',
    components: [/* SCThemeProvider, MuiThemeProvider */],  // <- an array contains a chain of component wrappers
    params: [
      { name: 'Dark Theme', props: { theme: /* dark*/ }, default: true },
      { name: 'Light Theme', props: { theme: /* light*/ } },
    ],
    options: {
      deep: false,                                          // <- true to inject props to all components
      disable: false,                                       // <- true to ignore the whole context
      cancelable: false,                                    // <- true to give an option to opt-out temporarily
    },
  },
];
```

- Config expects to be an array contains object for defining contextual nodes.
- You can provide multiple contextual nodes by adding more members with the same shape into the array. They are
injected by the addon automatically (top(outer) -> down(inner).
- It is possible to have multiple parent providers chaining together (left(outer) -> right(inner)).
- Additional params or context nodes can be introduced in the level of a story (but can not overridden).
- The addon will persist the active props, and fallback to the default setting or the first param if the param were
gone from story to story.
