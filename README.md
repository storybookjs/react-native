# React Storybook Story

A component to add additional information with your [react-storybook](#) stories.

![React Storybook Screenshot](docs/screenshot.png)

To get started, install the component as a `devDependency`

```shell
npm i -D react-storybook-story
```

When writing stories, wrap your component with the `<Story />` component and give it documentation via the `info` parameter.

```
import Story from 'react-storybook-story';
import 'react-storybook-story/src/styles.css';

const stories = storiesOf('<MyComponent />', module);

stories.add('my-example-story', function () {
  const info = \`
    # My Example Story
    This is an example story to...
  \`;

  return (
    <Story info={info}>
      <MyComponent foo={'bar'} />
    </Story>
  );
});
```

## Credits

- [markdowncss/modest](https://github.com/markdowncss/modest)
