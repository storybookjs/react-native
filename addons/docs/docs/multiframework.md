# Storybook Docs framework dev guide

Storybook Docs [provides basic support for all non-RN Storybook view layers](../README.md#framework-support) out of the box. However, some frameworks have been docs-optimized, adding features like automatic props table generation and inline story rendering. This document is a dev guide for how to set up a new framework in docs.

- [Adding a preset](#adding-a-preset)
- [Props tables](#props-tables)
- [Component descriptions](#component-descriptions)
- [Inline story rendering](#inline-story-rendering)

## Adding a preset

To get basic support, you need to add a [preset](https://storybook.js.org/docs/presets/introduction). By default this doesn't need to do much.

Here's a basic preset for `@storybook/html` in `addons/docs/html/preset.js`:

```js
module.exports = require('../dist/frameworks/common/makePreset').default('html');
```

This automatically adds [DocsPage](./docspage.md) for each story, as well as webpack/babel settings for MDX support.

There is also a little hoop-jumping that will hopefully be unnecessary soon.

`addons/docs/src/frameworks/html/config.js`

```js
import { addParameters } from '@storybook/html';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});
```

`addons/docs/html/config.js`

```js
module.exports = require('../dist/frameworks/html/config');
```

## Props tables

Props tables are enabled by the framework-specific `docs.extractProps` parameter, which extracts a component's props into a common data structure.

Here's how it's done in Vue's framework-specific `config.js`:

```js
import { extractProps } from './extractProps';

addParameters({
  docs: {
    // `container`, `page`, etc. here
    extractProps,
  },
});
```

The `extractProps`function receives a component as an argument, and returns an object of type [`PropsTableProps`](https://github.com/storybookjs/storybook/blob/next/lib/components/src/blocks/PropsTable/PropsTable.tsx#L147), which can either be a array of `PropDef` rows (React), or a mapping of section name to an array of `PropDef` rows (e.g. `Props`/`Events`/`Slots` in Vue).

```ts
export interface PropDef {
  name: string;
  type: any;
  required: boolean;
  description?: string;
  defaultValue?: any;
}
```

So far, in React and Vue, the implementation of this extraction is as follows:

- A webpack loader is added to the user's config via the preset
- The loader annotates the component with a field, `__docgenInfo`, which contains some metadata
- The view-layer specific `extractProps` function translates that metadata into `PropsTableProps`

However, for your framework you may want to implement this in some other way. There is also an effort to load data from static JSON files for performance [#7942](https://github.com/storybookjs/storybook/issues/7942).

## Component descriptions

Component descriptions are enabled by the `docs.extractComponentDescription` parameter, which extract's a component description (usually from source code comments) into a markdown string.

It follows the pattern of [Props tables](#props-tables) above, only it's even simpler because the function output is simply a string (or null if there no description).

## Inline story rendering

Inline story rendering is another framework specific optimization, made possible by the `docs.prepareForInline` parameter.

Again let's look at Vue's framework-specific `config.js`:

```js
import toReact from '@egoist/vue-to-react';

addParameters({
  docs: {
    // `container`, `page`, etc. here
    prepareForInline: storyFn => {
      const Story = toReact(storyFn());
      return <Story />;
    },
  },
});
```

The input is the story function, and the output is a React element, because we render docs pages in react. In the case of Vue, all of the work is done by the `@egoist/vue-to-react` library. If there's no analogous library for your framework, you may need to figure it out yourself!
