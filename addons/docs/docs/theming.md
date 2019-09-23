# Storybook Docs Theming

[Storybook Docs](../README.md) is themable! There are three different levels of theming, just to keep things interesting:

- [Storybook theming](#storybook-theming)
- [CSS escape hatches](#css-escape-hatches)
- [MDX component overrides](#mdx-component-overrides)

## Storybook theming

Storybook theming is the **recommended way** to theme your docs. If you update your storybook theme according to [the documentation](https://storybook.js.org/docs/configurations/theming/), Storybook Docs should adapt in reasonable ways.

For example, here's how to change your docs (and Storybook) to the dark theme, by modifying `.storybook/config.js`:

```js
import { addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';

addParameters({
  options: {
    theme: themes.dark,
  },
});
```

## CSS escape hatches

The Storybook theme API is narrow by design. If you want to have fine-grained control over the CSS, all of the Docs components are tagged with class names to make this possible. This is advanced usage: use at your own risk.

The classes correspond to markdown elements (e.g. `sbdocs-h1`, `sbdocs-p`, etc.) to UI elements on the page (e.g. `sbdocs-container`, `sbdocs-content`, etc.). To see the currently available classes, simply "inspect element" in your browser.

You can style these classes in `.storybook/preview-head.html`. For example, here's how to make the content wider for UHD displays:

```html
<style>
  .sbdocs.sbdocs-content {
    max-width: 1440px;
  }
</style>
```

> NOTE: All of these elements also have the `sbdocs` class, which is simply an idiomatic way of increasing the CSS specificity so you don't have to use `!important`.

## MDX component overrides

If you're using MDX, there's one more level of themability. MDX allows you to [completely override the components](https://mdxjs.com/advanced/components) that are rendered from markdown using a `components` parameter. This is an advanced usage that we don't officially support in Storybook, but it's a powerful mechanism if you need it.

Here's how you might insert a custom code renderer for `code` blocks on the page, in `.storybook/config.js`:

```js
import { addParameters } from '@storybook/react';
import { CodeBlock } from './CodeBlock';

addParameters({
  docs: {
    components: {
      code: CodeBlock,
    },
  },
});
```

## More resources

Want to learn more? Here are some more articles on Storybook Docs:

- References: [README](../README.md) / [DocsPage](docspage.md) / [MDX](mdx.md) / [FAQ](faq.md) / [Recipes](recipes.md)
- Vision: [Storybook Docs sneak peak](https://medium.com/storybookjs/storybook-docs-sneak-peak-5be78445094a)
- Announcement: [DocsPage](https://medium.com/storybookjs/storybook-docspage-e185bc3622bf)
- Example: [Storybook Design System](https://github.com/storybookjs/design-system)
- [Technical preview guide](https://docs.google.com/document/d/1un6YX7xDKEKl5-MVb-egnOYN8dynb5Hf7mq0hipk8JE/edit?usp=sharing)
