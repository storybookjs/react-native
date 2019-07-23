---
id: 'module-story-format'
title: 'Module Story Format'
---

Storybook's module story format is the recommended way to [write stories](../../basics/writing-stories/) since Storybook 5.2.

It's called "module" format because the stories and component metadata are defined as ES6 modules. Every module story file consists of a required default export and one or more named exports.

The module format is supported in all frameworks except React Native, where you should use the [storiesOf format](../storiesof-story-format) instead.

## Default export

The default export defines metadata about your component, including the `component` itself, its `title` (where it will show up in the [navigation UI story hierarchy](../../basics/writing-stories/#story-hierarchy)), [decorators](../../basics/writing-stories/#decorators), and [parameters](../../basics/writing-stories/#parameters).

```js
import MyComponent from './MyComponent';

export default {
  title: 'Path|To/MyComponent',
  component: MyComponent,
  decorators: [ ... ],
  parameters: { ... }
}
```

For more examples, see [writing stories](../../basics/writing-stories/)

## Story exports

By default every named export in the file represents a story function.

Story functions can be annotated with a `story` object to define story-level [decorators](../../basics/writing-stories/#decorators) and [parameters](../../basics/writing-stories/#parameters), and also to define the `name` of the story.

The `name` is useful if you want to use names with spaces, names that correspond to restricted keywords in Javascript, or names that collide with other variables in the file. If it's not specified, the export name will be used instead.

```js
export const simple = () => <MyComponent prop1={val1} />;
simple.story = {
  name: 'default', // can't be used as a named export
  decorators: [ ... ],
  parameters: { ... }
};
```

## Non-story exports

In some cases, you may want to export a mixture of story and non-stories. For example., it can be useful to export data that's used in your stories.

To make this possible, you can use optional `includeStories` and `excludeStories` configuration fields in the default export, which can be set to either an array of strings, or a regular expression.

Consider the following story file:

```js
import React from 'react';
import MyComponent from './MyComponent';
import someData from './data.json';

export default {
  title: 'MyComponent',
  component: MyComponent,
  includeStories: ['simpleStory', 'complexStory']
}
export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, { bar: 'baz', baz: someData }};
export const simpleStory = () => <MyComponent data={sompleData} />;
export const complexStory = () => <MyComponent data={complexData} />;
```

When Storybook loads this file, it will see all the exports, but it will ignore the data exports and only treat `simpleStory` and `complexStory` as stories.

For this specific example the equivalent result can be achieved in a few ways depending on what's convenient:

- `includeStories: ['simpleStory', 'complexStory']`
- `includeStories: /.*Story$/`
- `excludeStories: ['simpleData', 'complexData']`
- `excludeStories: /.*Data$/`
