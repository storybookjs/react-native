# React Storybook Story

A component to add additional information with your [react-storybook](#) stories.

![React Storybook Screenshot](docs/screenshot.png)

To get started, install the module as a `devDependency`

```shell
npm install -D react-storybook-story
```

When writing stories, wrap your component with the `<Story />` component and use the `info` parameter to give additional info.

```js
import {storiesOf} from '@kadira/storybook';
import Story from 'react-storybook-story';
import 'react-storybook-story/styles.css';

storiesOf('<MyComponent />', module)
  .add('my-example-story', function () {
    const info = `
      This story will render **MyComponent** with the
      _foo_ parameter set to "bar"
    `;
    return (
      <Story info={info}>
        <MyComponent foo={'bar'} />
      </Story>
    );
  });
```

## The FAQ

### Error loading styles.css file

To load the stylesheet make sure your webpack config has `style-loader` and `raw-loader` setup properly. Modify your `.storybook/webpack.config.js` file to include the `style-loader`.

```js
const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css?$/,
        loaders: ['style', 'raw'],
        include: path.resolve(__dirname, '../'),
      },
    ],
  },
};
```

## Credits

- markdown styles are based on [markdowncss/modest](https://github.com/markdowncss/modest)
