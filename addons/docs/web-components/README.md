# Storybook Docs for Web Components

## Installation

- Be sure to check the [installation section of the general addon-docs page](../README.md) before proceeding.
- Be sure to have a [custom-elements.json](./#custom-elementsjson) file.
- Add to your `.storybook/preview.js`

  ```js
  import { setCustomElements } from '@storybook/web-components';
  import customElements from '../custom-elements.json';

  setCustomElements(customElements);
  ```

- Add to your story files

  ```js
  export default {
    title: 'Demo Card',
    component: 'your-component-name', // which is also found in the `custom-elements.json`
  };
  ```

### custom-elements.json

In order to get documentation for web-components you will need to have a [custom-elements.json](https://github.com/webcomponents/custom-elements-json) file.

You can hand write it or better generate it. Depending on the web components sugar you are choosing your milage may vary.

Known analyzers that output `custom-elements.json`:

- [web-component-analyzer](https://github.com/runem/web-component-analyzer)
  - Supports LitElement, Polymer, Vanilla, (Stencil)
- [stenciljs](https://stenciljs.com/)
  - Supports Stencil (but does not have all metadata)

It basically looks like this:

```json
{
  "version": 2,
  "tags": [
    {
      "name": "demo-wc-card",
      "properties": [
        {
          "name": "header",
          "type": "String",
          "attribute": "header",
          "description": "Shown at the top of the card",
          "default": "Your Message"
        }
      ],
      "events": [],
      "slots": [],
      "cssProperties": []
    }
  ]
}
```

For a full example see the [web-components-kitchen-sink/custom-elements.json](../../../examples/web-components-kitchen-sink/custom-elements.json).

## Stories not inline

By default stories are rendered inline.
For web components that is usually fine as they are style encapsulated via shadow dom.
However when you have a style tag in you template it might be best to show them in an iframe.

To always use iframes you can set

```js
addParameters({
  docs: {
    inlineStories: false,
  },
});
```

or add it to individual stories.

```js
<Story inline={false} />
```
