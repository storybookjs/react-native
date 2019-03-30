# Storybook Addon Contexts

**Storybook Addon Contexts** is an addon for driving your components under dynamic contexts in Storybook.


## 💡 Why you need this?

Real world users expects your application being customizable, that is why often your components are **polymorphic**:
they simply need to adapt themselves under different contextual environments.  Imagine your components can speak
Chinese, English, or even French, and they change their skin tone under dark or light theme.  Yeah, you want to make
sure a component look great in all scenario.

A good practice to write maintainable components is separate the presentation and its business logic.  Storybook is
a great place for exercising the visualization and interaction of your components, which may depended on a context.
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
2. Support dynamic contextual props switching from Storybook toolbar at runtime.  You can easily slicing into
   different environments (e.g. languages or themes ) to understand how your component is going to response.
3. Library agnostic: no presumption on what kind of components you want to wrap around your stories.  You can even
   use it to bridge with your favorite routing, state-management solutions, or even your own `React.context` provider.
4. Offer chainable and granular configurations.  It is even possible to customized at per story level.


## 🧰 Supported Environments

Make sure the version of your Storybook is above v5.  Currently, only React is being supported.  However, this addon
is aiming to expend its framework supports in the near future.


## 🎬 Getting started

To get it started, add this package into your project:

```bash
yarn add -D addon-contexts
```

Then, register the addon by adding the following line into your `addon.js` file (you should be able to find the file
under the storybook config directory of your project):

```js
import 'addon-contexts/register';
```

To load your contextual setups for your stories globally, adding the following lines into `config.js` file (you should
see it near your `addon.js` file):

```js
import { addDecorator } from '@storybook/react';
import { withContexts } from 'addon-contexts';
import { contexts } from './configs/contexts'; // we will define the contextual setups later in API section

addDecorator(withContexts(contexts));

...
```

Alternatively, just like other addons, you can also just use this addon for a given set of stories:

```js
import { storiesOf } from '@storybook/react';
import { withContexts } from 'addon-contexts';
import { contexts } from './configs/contexts';

const stories = storiesOf('Component With Contexts', module);

stories.addDecorator(withContexts(contexts));

...
```

## ⚙️ Configurations (APIs)

It is recommended to have a separate file for managing your contextual setups.  Let's add a file named `context.js`
first.  To use this addon to inject your theming contexts, let's take the following example:

```js
// @context.js (example)
const dark = {/* your dark theme */};
const light = {/* your light theme */};

export const contexts = [
  {
    icon: 'box',            // a icon displayed in the Storybook toolbar to control contextual props
    title: 'Themes',        // an unique name of a contextual environment
    components: [           // an array of components that is going to be injected to wrap stories
      /* SCThemeProvider, */
      /* MuiThemeProvider, */
    ],
    params: [               // an array of params contains a set of predefined `props` for `components`
      { name: 'Light Theme', props: { theme: light } },
      { name: 'Dark Theme', props: { theme: dark }, default: true },
    ],
    options: {
      deep: false,          // pass the `props` deeply into all wrapping components
      disable: false,       // disable this contextual environment completely
      cancelable: false,    // allow this contextual environment to be opt-out optionally in toolbar
    },
  },
  /* ... */                 // multiple contexts setups are supported
];
```

### `withContexts(contexts)` 

An decorator for wrapping your stories under your predefined `contexts`.  This means multiple contextual environments
are supported.  They are going to be loaded layer by layer and wraped in a descending oder (top -> down -> story). 
The `contexts` is an array of object that should has the following properties:

---

### `icon : string?` (default `undefined`)

A icon displayed in the Storybook toolbar to control contextual props. This addon allows you to define an icon for
each contextual environment individually.  Take a look from what are currently supported
[icon lists](https://storybooks-official.netlify.com/?path=/story/basics-icon--labels) from the official Storybook
story.  You must define an icon first if you want to take advantage on switching props dynamically in your Storybook
toolbar.

### `title : string` (required)

An unique name of a contextual environment.  Note, if you have duplicated name, the later is ignored.

### `components : React.ComponentType[]` (required)

An array of components that is going to be injected to wrap stories.  This means this addon allow multiple wrapping
components coexisted.  The wrapping sequence is from the left to right (parent -> children -> story). This nested
wrapping behaviour can be useful in some cases; for instance, in the above example, we are wrapping stories under
`styled-componnets` and `material-ui` theme providers.

Note, typically, components are `Providers` from [React Context API](https://reactjs.org/docs/context.html).  However,
it is really up to your use cases.

### `params : object[]` (required) 

An array of params contains a set of predefined `props` for `components`.

Note:
1. additional params can be appended at the story level later; however, they are never be able to overridden the
global list. So it is important to have non-collided names.
2. the addon will persist the selected params between stories, and it fallback to the default then the first param
if the param were gone from story to story.

This object has the following properties: 

### `params.name : string` (required) 

An unique name for representing the props.

### `params.props : object | null:` (required) 

The `props` that is accepted by the wrapping component(s).

### `params.defualt : true?` (default: `undefined`)

Set to `true` if you want to use this param initially.  Note, only the first one marked as default is identified;

## `options`

A set of options offers more granular control over the defined contextual environment.  Note, they can be overridden
at the story level.

### `options.deep : boolean?` (default: `false`)

Pass the `props` deeply into all wrapping components.  Useful when you want them all taking the same props.

### `options.disable : boolean?` (default: `false`)

Disable this contextual environment completely.  Useful when you want to opt-out this context from a given story.

### `options.cancelable : boolean?` (default: `false`)

Allow this contextual environment to be opt-out optionally in toolbar.  When set to `true`, an **Off** option will
be shown at first in the toolbar menu in your Storybook.
