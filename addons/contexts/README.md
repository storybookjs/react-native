# Storybook Addon Contexts

[![npm version](https://badge.fury.io/js/addon-contexts.svg)](https://badge.fury.io/js/addon-contexts)

**Storybook Addon Contexts** is an addon for driving your components under dynamic contexts in 
[Storybook](https://storybook.js.org/).

## 💡 Why you need this?

Real world users expects your application being customizable, that is why often your components are **polymorphic**:
they simply need to adapt themselves under different contextual environments.  Imagine your components can speak
Chinese, English, or even French, and they change their skin tone under dark or light theme.  Yeah, you want to make
sure a component look great in all scenario.

A good practice to write maintainable components is separate the presentation and its business logic.  Storybook is
a great place for exercising the visualization and interaction of your components, which may depend on some contexts.
Often enough, you will find it become very tedious to wrap each component deeply with its contextual environments
before you can really write the main story.  You even start to write extra components or factory functions just to
make your life easier.  How about changing the context of your story dynamically?!  There were simply having no good
way so you ended up writing stories like an accountant.

That is why you need this.  An elegant way to wrap your component stories and change their contextual environment
directly and dynamically in Storybook UI!  Kind of like a dependency injection, eh!  The best bit is **you define it
once then apply it everywhere**.


## ✅ Features

1. Define a single global file for managing contextual environments (a.k.a. containers) for all of your stories 
   declaratively.  No more repetitive setups or noisy wrapping, making your stories more focused and readable.
2. Support dynamic contextual props switching from Storybook toolbar at runtime.  You can easily slice into
   different environments (e.g. languages or themes ) to understand how your component is going to response.
3. Library agnostic: no presumption on what kind of components you want to wrap around your stories.  You can even
   use it to bridge with your favorite routing, state-management solutions, or even your own
   [React Context](https://reactjs.org/docs/context.html) provider.
4. Offer chainable and granular configurations.  It is even possible to fine-tune at per story level.


## 🧰 Requirements

Make sure the version of your Storybook is above v5.  Currently, this addon supports the following frameworks:
**React**, and **Vue**.  Other frameworks might get supported in the near future (PRs are welcoming).


## 🎬 Getting started

To get it started, add this package into your project:

```bash
yarn add -D addon-contexts
```

Then, register the addon by adding the following line into your `addon.js` file (you should be able to find the file
under the storybook config directory of your project):

```js
import '@storybook/addon-contexts/register';
```

To load your contextual setups for your stories globally, adding the following lines into `config.js` file (you should
see it near your `addon.js` file):

```js
import { addDecorator } from '@storybook/react'; // or '@storybook/vue'
import { withContexts } from '@storybook/addon-contexts/react'; // or '@storybook/addon-contexts/vue'
import { contexts } from './configs/contexts'; // we will define the contextual setups later in API section

addDecorator(withContexts(contexts));
```

Alternatively, just like other addons, you can use this addon only for a given set of stories:

```js
import { storiesOf } from '@storybook/react'; // or '@storybook/vue'
import { withContexts } from '@storybook/addon-contexts/react'; // or '@storybook/addon-contexts/vue'
import { contexts } from './configs/contexts';

const story = storiesOf('Component With Contexts', module)
  .addDecorator(withContexts(contexts));  // use this addon with a default contextual environment setups
```

Finally, you may want to modify the default setups at per story level.  Here is how you can do this:

```js
story.add(
  () => { /* some stories */ },
  { contexts: [{ /* the modified setup goes here, sharing the same API signatures */ }] },
);
```

## ⚙️ Setups

### Overview

It is recommended to have a separate file for managing your contextual environment setups.  Let's add a file named
`contexts.js` first.  Before diving into API details, here is an overview on the landscape.  For example (in React),
to inject component theming contexts to both `styled-components` and `material-ui` theme providers in stories:

```js
export const contexts = [
  {
    icon: 'box',            // a icon displayed in the Storybook toolbar to control contextual props
    title: 'Themes',        // an unique name of a contextual environment
    components: [           // an array of components that is going to be injected to wrap stories
      /* Styled-components ThemeProvider, */
      /* Material-ui ThemeProvider, */
    ],
    params: [               // an array of params contains a set of predefined `props` for `components`
      { name: 'Light Theme', props: { theme /* : your dark theme */ } },
      { name: 'Dark Theme', props: { theme /* : your light theme */ }, default: true },
    ],
    options: {
      deep: true,           // pass the `props` deeply into all wrapping components
      disable: false,       // disable this contextual environment completely
      cancelable: false,    // allow this contextual environment to be opt-out optionally in toolbar
    },
  },
  /* ... */                 // multiple contexts setups are supported
];
```

---

### APIs

#### `withContexts(contexts) : function`

A decorating function for wrapping your stories under your predefined `contexts`.  This means multiple contextual
environments are supported.  They are going to be loaded layer by layer and wraped in a descending oder (top -> down
-> story).  The `contexts` is an array of object that should has the following properties:

---

#### `icon : string?`
(default `undefined`)

A icon displayed in the Storybook toolbar to control contextual props. This addon allows you to define an icon for
each contextual environment individually.  Take a look from what are currently supported
[icon lists](https://storybooks-official.netlify.com/?path=/story/basics-icon--labels) from the official Storybook
story.  You must define an icon first if you want to take advantage on switching props dynamically in your Storybook
toolbar.

---

#### `title : string`  
(required)

An unique name of a contextual environment; if duplicated names provided, the later is going to be ignored.

---

#### `components : (Component|string)[]`  
(required)

An array of components that is going to be injected to wrap stories.  This means this addon allow multiple wrapping
components coexisted.  The wrapping sequence is from the left to right (parent -> children -> story).  This nested
wrapping behaviour can be useful in some cases; for instance, in the above example, we are wrapping stories under
`styled-componnets` and `material-ui` theme providers.  Also, you can use this addon to wrap any valid HTML tags.

---

#### `params : object[] | undefined`  
(default: `undefined`)

An array of params contains a set of predefined `props` for `components`. This object has the following properties: 

#### `params.name : string`  
(required) 

An unique name for representing the props.

#### `params.props : object | null:`  
(required) 

The `props` that is accepted by the wrapping component(s).

#### `params.defualt : true?`  
(default: `undefined`)

Set to `true` if you want to use this param initially.  Only the first one marked as default is identified.

---

#### `options`

A set of options offers more granular control over the defined contextual environment.  These properties can be
overridden at the story level:

#### `options.deep : boolean?`  
(default: `false`)

Pass the `props` deeply into all wrapping components.  Useful when you want them all to be passed with the same props.

#### `options.disable : boolean?`  
(default: `false`)

Disable this contextual environment completely.  Useful when you want to opt-out this context from a given story.

#### `options.cancelable : boolean?`  
(default: `false`)

Allow this contextual environment to be opt-out optionally in toolbar.  When set to `true`, an **Off** option will
be shown at first in the toolbar menu in your Storybook.

## 📔 Notes

1. You can use this addon to inject any valid components, that is why `icon`, and `params` can be just optional.
2. As mentioned, extra contextual environment setups can be added at the story level.  Please make sure they are
   passed via the second argument as `{ contexts: [{ /* extra contexts */ }}`.
3. Additional `params` can be "appended" into an existed setups at the story level too (make sure it goes with the
   correct `title`); however, they are never be able to overridden the default setups. So it is important to have
   non-collided names.
4. The addon will persist the selected params (the addon state) between stories at run-time (similar to other
   addons). If the active param were gone after story switching, it fallback to the default then the first.  As a
   rule of thumbs, whenever collisions made possible, always the first wins.

## 📖 License

MIT
