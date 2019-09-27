---
id: 'writing-stories'
title: 'Writing Stories'
---

A Storybook is a collection of stories. Each story represents a single visual state of a component.

> Technically, a story is a function that returns something that can be rendered to screen.

## Basic story

Here is a simple example of stories for a `Button` component:

```js
import React from 'react';
import { action } from '@storybook/addon-actions';
import Button from './Button';

export default {
  component: Button,
  title: 'Button',
};

export const text = () => <Button onClick={action('clicked')}>Hello Button</Button>;

export const emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
```

This is what you'll see in Storybook:

![Basic stories](../static/basic-stories.png)

The named exports define the Button's stories, and the `default` export defines metadata that applies to the group. In this case, the `component` is `Button`. The `title` determines the title of the group in Storybook's left-hand navigation panel and should be unique, i.e. not re-used across files. In this case it's located at the top level, but typically it's [positioned within the story hierarchy](#story-hierarchy).

This example is written in Storybook's [Component Story Format (CSF)](../../formats/component-story-format/). Storybook also supports:

- a classic [storiesOf API](../../formats/storiesof-api/), which adds stories through Storybook's API.
- an experimental [MDX syntax](../../formats/mdx-syntax/), which mixes longform Markdown docs and JSX stories.

Since CSF is a new addition to Storybook, most Storybook examples you'll find in the wild are written to the [storiesOf API](../../formats/storiesof-api/).

Furthermore, Storybook for React Native currently only supports the `storiesOf` format. React Native will get CSF and MDX support in a future release.

## Story file location

Stories are easier to maintain when they are located alongside the components they are documented. We recommend:

```plaintext
•
└── src
    └── components
        └── button
            ├── button.js
            └── button.stories.js
```

It's up to you to find a naming/placing scheme that works for your project/team. Other naming conventions:

<details>
  <summary>stories sub-directory in component directory</summary>

```plaintext
•
└── src
    └── components
        └── button
            ├── button.js
            └── stories
                └── button.stories.js
```

</details>

<details>
  <summary>stories directory outside src directory</summary>

```plaintext
•
├── src
│   └── components
│       └── button.js
└── stories
    └── button.stories.js
```

</details>

## Loading stories

Stories are loaded in the `.storybook/config.js` file.

The most convenient way to load stories is by filename. For example, if you stories files are located in the `src/components` directory, you can use the following snippet:

```js
import { configure } from '@storybook/react';

configure(require.context('../src/components', true, /\.stories\.js$/), module);
```

> NOTE: The `configure` function should be called only once in `config.js`.

The `configure` function accepts:

- A single `require.context` "`req`"
- An array of `req`s to load from multiple locations
- A loader function that should return void or an array of module exports

If you want to load from multiple locations, you can use an array:

```js
import { configure } from '@storybook/react';

configure([
  require.context('../src/components', true, /\.stories\.js$/)
  require.context('../lib', true, /\.stories\.js$/)
], module);
```

Or if you want to do some custom loading logic, you can use a loader function. Just remember to return an array of module exports if you want to use Component Story Format. Here's an example that forces files to load in a specific order.

```js
import { configure } from '@storybook/react';

const loaderFn = () => ([
  require('./welcome.stories.js'),
  require('./prelude.stories.js'),
  require('./button.stories.js'),
  require('./input.stories.js'),
]);

configure(loaderFn, module);
```

Here's another example that mixes manual loading with glob-style loading:

```js
import { configure } from '@storybook/react';

const loaderFn = () => {
  const allExports = [require('./welcome.stories.js')];
  const req = require.context('../src/components', true, /\.stories\.js$/);
  req.keys().forEach(fname => allExports.push(req(fname)));
  return allExports;
};

configure(loaderFn, module);
```

Storybook uses Webpack's [require.context](https://webpack.js.org/guides/dependency-management/#require-context) to load modules dynamically. Take a look at the relevant Webpack [docs](https://webpack.js.org/guides/dependency-management/#require-context) to learn more about how to use `require.context`.

If you are using the `storiesOf` API directly, or are using `@storybook/react-native` where CSF is unavailable, you should use a loader function with **no return value**:

```js
import { configure } from '@storybook/react';

const loaderFn = () => {
  // manual loading
  require('./welcome.stories.js');
  require('./button.stories.js');
  
  // dynamic loading, unavailable in react-native
  const req = require.context('../src/components', true, /\.stories\.js$/);
  req.keys().forEach(req(fname));
};

configure(loaderFn, module);
```

Furthermore, the **React Native** packager resolves all imports at build-time, so it's not possible to load modules dynamically. There is a third party loader [react-native-storybook-loader](https://github.com/elderfo/react-native-storybook-loader) to automatically generate the import statements for all stories.

## Decorators

A decorator is a way to wrap a story with a common set of components, for example if you want to wrap a story in some formatting, or provide some context to the story.

Decorators can be applied globally, at the component level, or individually at the story level. Global decorators are typically applied in the Storybook config files, and component/story decorators are applied in the story file.

Here is an example of a global decorator which centers every story in the storybook:

```jsx
import React from 'react';
import { load, addDecorator } from '@storybook/react';

addDecorator(storyFn => <div style={{ textAlign: 'center' }}>{storyFn()}</div>);

load(require.context('../src/components', true, /\.stories\.js$/), module);
```

And here's an example of component/local decorators. The component decorator wraps all the stories in a yellow frame, and the story director wraps a single story in an additional red frame.

```jsx
import React from 'react';
import MyComponent from './MyComponent';

export default {
  title: 'MyComponent',
  decorators: [storyFn => <div style={{ backgroundColor: 'yellow' }}>{storyFn()}</div>],
};

export const normal = () => <MyComponent />;
export const special = () => <MyComponent text="The Boss" />;
special.story = {
  decorators: [storyFn => <div style={{ border: '5px solid red' }}>{storyFn()}</div>],
};
```

Decorators are not just for story formatting, they are generally useful for any kind of context needed by a story.

- Theming libraries require a theme to be passed in through context. Rather than redefining this in every story, just add a decorator.
- Likewise, state management libraries like Redux provide a global data store through context.
- Finally, Storybook [addons](../../addons/introduction) heavily use decorators. For example, the Storybook's [Knobs addon](https://github.com/storybookjs/storybook/tree/next/addons/knobs) uses decorators to modify the input properties of the story based on a UI.

## Parameters

Parameters are custom metadata for a story. Like decorators, they can also be hierarchically applied: globally, at the component level, or locally at the story level.

Here's an example where we are annotating our stories with [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) notes using parameters, to be displayed in the [Notes addon](https://github.com/storybookjs/storybook/tree/next/addons/notes).

We first apply some notes globally in the Storybook config.

```js
import { load, addParameters } from '@storybook/react';
import defaultNotes from './instructions.md';
addParameters({ notes: defaultNotes });
```

This would make sense if, for example, `instructions.md` contained instructions on how to document your components when there is no documentation available.

Then for components that did have documentation, we might override it at the component/story level:

```jsx
import React from 'react';
import MyComponent from './MyComponent';
import componentNotes from './notes.md';
import specialNotes from '/.special.md';

export default {
  title: 'MyComponent',
  parameters: { notes: componentNotes },
};

export const small = () => <MyComponent text="small" />;
export const medium = () => <MyComponent text="medium" />;
export const special = () => <MyComponent text="The Boss" />;
special.story = {
  parameters: { notes: specialNotes },
};
```

In this example, the `small` and `medium` stories get the component notes documented in `notes.md` (as opposed to the generic instructions in `instructions.md`). The `special` story gets some special notes.

## Searching

By default, search results will show up based on the file name of your stories. As of storybook 5, you can extend this with `notes` to have certain stories show up when the search input contains matches. For example, if you built a `Callout` component that you want to be found by searching for `popover` or `tooltip` as well, you could use `notes` like this:

```jsx
export const callout = () => <Callout>Some children</Callout>;
callout.story = {
  parameters: { notes: 'popover tooltip' },
};
```

## Story hierarchy

Stories can be organized in a nested structure using "/" as a separator, and can be given a top-level heading using a "|" root separator.

For example the following snippets nest the `Button` and `Checkbox` components within the `Atoms` group, under a top-level heading called `Design System`.

```jsx
// Button.stories.js
import React from 'react';
import Button from './Button';

export default {
  title: 'Design System|Atoms/Button',
};
export const normal = () => <Button onClick={action('clicked')}>Hello Button</Button>;
```

```jsx
// Checkbox.stories.js
import React from 'react';
import Checkbox from './Checkbox';

export default {
  title: 'Design System|Atoms/Checkbox',
};
export const empty = () => <Checkbox label="empty" />;
export const checked = () => <Checkbox label="checked" checked />;
```

If you prefer other characters as separators, you can configure this using the `hierarchySeparator` and `hierarchyRootSeparator` config options. See the
[configuration options parameter](/configurations/options-parameter) page to learn more.

## Generating nesting path based on \_\_dirname

Nesting paths can be programmatically generated with template literals because story names are strings.

One example would be to use `base` from [`paths.macro`](https://github.com/storybookjs/paths.macro):

```js
import React from 'react';
import base from 'paths.macro';
import BaseButton from '../components/BaseButton';

export default {
  title: `Other|${base}/Dirname Example`,
};
export const story1 = () => <BaseButton label="Story 1" />;
export const story2 = () => <BaseButton label="Story 2" />;
```

_This uses [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros)_.

## Run multiple storybooks

Multiple storybooks can be built for different kinds of stories or components in a single repository by specifying different port numbers in the start scripts:

```json
{
  "scripts": {
    "start-storybook-for-theme": "start-storybook -p 9001 -c .storybook-theme",
    "start-storybook-for-app": "start-storybook -p 8001 -c .storybook-app"
  }
}
```
