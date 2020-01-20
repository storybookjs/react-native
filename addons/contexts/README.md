# Storybook Addon Contexts

**Storybook Addon Contexts** is an addon for driving your components under dynamic contexts in
[Storybook](https://storybook.js.org/).

## 💡 Why you need this?

Real world users expects your application being customizable, that is why often your components are **polymorphic**:
they need to adapt themselves under different contextual environments. Imagine your components can speak
Chinese, English, or even French, and they change their skin tone under dark or light theme. Yeah, you want to make
sure a component looks great in all scenarios.

A good practice to write maintainable components is separate the presentation and its business logic. Storybook is
a great place for exercising the visualization and interaction of your components, which may depend on some contexts.
Often enough, you will find it become very tedious to wrap each component deeply with its contextual environments
before you can really write the main story. You even start to write extra components or factory functions just to
make your life easier. How about changing the context of your story dynamically?! There was simply no good way so 
you ended up writing stories like an accountant.

That is why you need this. An elegant way to wrap your component stories and change their contextual environment
directly and dynamically in Storybook UI! Kind of like a dependency injection, eh! The best bit is **you define it
once then apply it everywhere**.

## ✅ Features

1. Define a single global file for managing contextual environments (a.k.a. containers) for all of your stories
   declaratively. No more repetitive setups or noisy wrapping, making your stories more focused and readable.
2. Support dynamic contextual props switching from Storybook toolbar at runtime. You can slice into
   different environments (e.g. languages or themes ) to understand how your component is going to respond.
3. Library agnostic: no presumption on what kind of components you want to wrap around your stories. You can even
   use it to bridge with your favorite routing, state-management solutions, or even your own
   [React Context](https://reactjs.org/docs/context.html) provider.
4. Offer chainable and granular configurations. It is even possible to fine-tune at per story level.
5. Visual regression friendly. You can use this addon to drive the same story under different contexts to smoke
   test important visual states.

## 🧰 Requirements

Make sure the version of your Storybook is above v5. For the full list of the current supported frameworks, see
[Addon / Framework Support Table](../../ADDONS_SUPPORT.md).

## 🎬 Getting started

To get it started, add this package into your project:

```bash
yarn add -D @storybook/addon-contexts
```

within `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-contexts/register']
}
```

To load your contextual setups for your stories globally, add the following lines into `preview.js` file (you should
see it near your `addon.js` file):

```js
import { addDecorator } from '@storybook/[framework]';
import { withContexts } from '@storybook/addon-contexts/[framework]';
import { contexts } from './configs/contexts'; // we will define the contextual setups later in API section

addDecorator(withContexts(contexts));
```

Alternatively, like other addons, you can use this addon only for a given set of stories:

```js
import { withContexts } from '@storybook/addon-contexts/[framework]';
import { contexts } from './configs/contexts';

export default {
  title: 'Component With Contexts',
  decorators: [withContexts(contexts)],
};
```

Finally, you may want to modify the default setups at per story level. Here is how you can do this:

```js
export const defaultView = () => <div />;
defaultView.story = {
  parameters: {
    context: [{}]
  }
};
```

## ⚙️ Setups

### Overview

It is recommended to have a separate file for managing your contextual environment setups. Let's add a file named
`contexts.js` first. Before diving into API details, here is an overview on the landscape. For example (in React),
to inject component theming contexts to both `styled-components` and `material-ui` theme providers in stories:

```js
export const contexts = [
  {
    icon: 'box', // a icon displayed in the Storybook toolbar to control contextual props
    title: 'Themes', // an unique name of a contextual environment
    components: [
      // an array of components that is going to be injected to wrap stories
      /* Styled-components ThemeProvider, */
      /* Material-ui ThemeProvider, */
    ],
    params: [
      // an array of params contains a set of predefined `props` for `components`
      { name: 'Light Theme', props: { theme /* : your light theme */ } },
      { name: 'Dark Theme', props: { theme /* : your dark theme */ }, default: true },
    ],
    options: {
      deep: true, // pass the `props` deeply into all wrapping components
      disable: false, // disable this contextual environment completely
      cancelable: false, // allow this contextual environment to be opt-out optionally in toolbar
    },
  },
  /* ... */ // multiple contexts setups are supported
];
```

---

### APIs

#### `withContexts(contexts) : function`

A decorating function for wrapping your stories under your predefined `contexts`. This means multiple contextual
environments are supported. They are going to be loaded layer by layer and wrapped in a descending oder (top -> down
-> story). The `contexts` is an array of objects that should have the following properties:

---

#### `icon : string?`

(default `undefined`)

An icon displayed in the Storybook toolbar to control contextual props. This addon allows you to define an icon for
each contextual environment individually. Take a look at the currently supported
[icon lists](https://storybooks-official.netlify.com/?path=/story/basics-icon--labels) from the official Storybook
story. You must define an icon first if you want to take advantage of switching props dynamically in your Storybook
toolbar.

---

#### `title : string`

(required)

A unique name of a contextual environment; if duplicate names are provided, the latter is going to be ignored.

---

#### `components : (Component|string)[]`

(required)

An array of components that is going to be injected to wrap stories. This means this addon allows multiple wrapping
components to coexist. The wrapping sequence is from the left to right (parent -> children -> story). This nested
wrapping behaviour can be useful in some cases; for instance, in the above example, we are wrapping stories under
`styled-components` and `material-ui` theme providers. Also, you can use this addon to wrap any valid HTML tags.

---

#### `params : object[] | undefined`

(default: `undefined`)

An array of params contains a set of predefined `props` for `components`. This object has the following properties:

#### `params.name : string`

(required)

A unique name for representing the props.

#### `params.props : object | null:`

(required)

The `props` that are accepted by the wrapping component(s).

#### `params.default : true?`

(default: `undefined`)

Set to `true` if you want to use this param initially. Only the first one marked as default is identified.

---

#### `options`

A set of options offers more granular control over the defined contextual environment. These properties can be
overridden at the story level:

#### `options.deep : boolean?`

(default: `false`)

Pass the `props` deeply into all wrapping components. Useful when you want them all to be passed with the same props.

#### `options.disable : boolean?`

(default: `false`)

Disable this contextual environment completely. Useful when you want to opt-out this context from a given story.

#### `options.cancelable : boolean?`

(default: `false`)

Allow this contextual environment to be opt-out optionally in toolbar. When set to `true`, an **Off** option will
be shown at first in the toolbar menu in your Storybook.

## 📔 Notes

1. You can use this addon to inject any valid components, that is why `icon` and `params` can be optional.
2. As mentioned, extra contextual environment setups can be added at the story level. Please make sure they are
   passed via the second argument as `{ contexts: [{ /* extra contexts */ }}`.
3. Additional `params` can be "appended" into an existing setup at the story level too (make sure it goes with the
   correct `title`); however, they are never be able to overridden the default setups. So it is important to have
   non-colliding names.
4. The addon will persist the selected params (the addon state) between stories at run-time (similar to other
   addons). If the active params were gone after story switching, it falls back to the default then the first. As a
   rule of thumb, whenever collisions are possible, the first always wins.
5. Query parameters are supported for pre-selecting contexts param, which comes in handy for visual regression testing.
   You can do this by appending `&contexts=[name of contexts]=[name of param]` in the URL under iframe mode. Use `,`
   to separate multiple contexts (e.g. `&contexts=Theme=Forests,Language=Fr`).

## 📖 License

MIT
