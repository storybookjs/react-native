import marked from 'marked';

export const docsData = {
  categories: [
    {
      id: 'cat-1',
      title: 'CAT 1',
    },
    {
      id: 'cat-2',
      title: 'CAT 2',
    },
  ],
  sections: [
    {
      id: 'basics',
      heading: 'Basics',
      items: [
        { id: 'getting-started', title: 'Getting Started' },
        { id: 'writing-stories', title: 'Writing Stories' },
        { id: 'build-as-a-static-app', title: 'Build as a Static App' },
      ],
    },
    {
      id: 'guides',
      heading: 'Guides',
      items: [
        { id: 'getting-started', title: 'Getting Started' },
        { id: 'writing-stories', title: 'Writing Stories' },
        { id: 'build-as-a-static-app', title: 'Build as a Static App' },
      ],
    },
    {
      id: 'configurations',
      heading: 'Configuations',
      items: [
        { id: 'default-config', title: 'Default Config' },
        { id: 'webpack', title: 'Webpack' },
        { id: 'babel', title: 'Babel' },
      ],
    },
  ],
  selectedItem: {
    id: 'writing-stories',
    section: 'basics',
    title: 'Writing Stories',
    content: marked(`
You need to write stories to show your components inside Storybook.<br/>
We've a set of APIs allows you to write stories and do more with them.

When you are writing stories, you can follow these guidelines<br/>
to write great stories.

* Write UI components by passing data via props.
* In this way, you can isolate UI components easilly.
* Do not write app-specific code inside your UI components.

~~~js
import { linkTo } from @storybook/addon-links

storiesOf('Toggle', module)
  .add('on', () => {
    return <Toggle value={true} onChange={linkTo('Toggle', 'off')} />
  })
  .add('off', () => {
    return <Toggle value={false} onChange={linkTo('Toggle', 'on')} />
  });
~~~
    `),
  },
  featuredStorybooks: [
    {
      owner: 'https://avatars0.githubusercontent.com/u/698437?v=3&s=200',
      storybook: {
        name: 'React Dates',
        link: 'http://airbnb.io/react-dates/',
      },
      source: 'https://github.com/airbnb/react-dates',
    },

    {
      owner: 'https://avatars3.githubusercontent.com/u/239676?v=3&s=460',
      storybook: {
        name: 'React Native Web',
        link: 'https://necolas.github.io/react-native-web/storybook',
      },
      source: 'https://github.com/necolas/react-native-web',
    },

    {
      owner: 'https://avatars1.githubusercontent.com/u/15616844?v=3&s=200',
      storybook: {
        name: 'React Button',
        link: 'http://kadira-samples.github.io/react-button/',
      },
      source: 'https://github.com/kadira-samples/react-button',
    },
  ],
};
