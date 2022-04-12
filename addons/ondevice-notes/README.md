# Storybook Notes Addon for react-native

The Notes Addon allows you to write notes (text or markdown) for your stories in [Storybook](https://storybook.js.org).

## Installation

```sh
yarn add -D @storybook/addon-ondevice-notes
```

## Configuration

Then, add following content to `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-ondevice-notes'],
};
```

## Usage

Use the `notes` parameter to add a note to stories:

```js
export default {
  title: 'My title',
  component: MyComponent,
  parameters: {
    notes: `
     # Here I can add some markdown
     
     Put a full new line between each element.
    `,
  },
};
```

See the [example app](../../examples/native) for more examples.
