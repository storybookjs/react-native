# React Storybook Story

A component to add additional information with your [react-storybook](#) stories.

![React Storybook Screenshot](docs/screenshot.png)

To get started, install the component as a `devDependency`

```shell
npm i -D react-storybook-story
```

When writing stories, wrap your component with the `<Story />` component and use the `info` parameter to give additional info.

```jsx
import Story from 'react-storybook-story';
import 'react-storybook-story/src/styles.css';

const stories = storiesOf('<MyComponent />', module);

stories.add('my-example-story', function (context) {
  const info = `
    This is an _example_ story
  `;

  return (
    <Story context={context} info={info} propTables={[ MyComponent ]}>
      <MyComponent foo={'bar'} />
    </Story>
  );
});
```

To load the stylesheet make sure your webpack config has `style-loader` and `raw-loader` setup.

```js
const path = require('path');

module.exports = {
  module: {
    loaders: [
      { test: /\.css?$/, loaders: ['style', 'raw'], include: path.resolve(__dirname, '../') },
    ],
  },
};
```

## Credits

- markdown styles are based on [markdowncss/modest](https://github.com/markdowncss/modest)
