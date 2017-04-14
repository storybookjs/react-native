import { stripIndent } from 'common-tags';

const images = {
  basicsStories: require('./static/basic-stories.png'),
};

export default {
  id: 'slow-start-guide',
  title: 'Slow Start Guide',
  content: stripIndent`
    You may have tried to use our quick start guide to setup your project for Storybook. If you want to set up Storybook manually, this is the guide for you.

    > This will also help you to understand how Storybook works.

    ## Basics

    Storybook has its own Webpack setup and a dev server. Webpack setup is very similar to [Create React App](https://github.com/facebookincubator/create-react-app), but allows you to configure as you want.

    In this guide, we are trying to set up Storybook for your React project.

    ## Add @kadira/storybook

    First of all, you need to add \`@kadira/storybook\` to your project. To do that, simply run:

    ~~~sh
    npm i --save-dev @kadira/storybook
    ~~~

    ## Add react and react-dom
    Make sure that you have \`react\` and \`react-dom\` in your dependencies as well:

    ~~~sh
    npm i --save react react-dom
    ~~~

    Then add the following NPM script to your package json in order to start the storybook later in this guide:

    ~~~js
    {
      ...
      "scripts": {
        "storybook": "start-storybook -p 9001 -c .storybook"
      }
      ...
    }
    ~~~

    ## Create the config file

    Storybook can be configured in several different ways. That’s why we need a config directory. We've added a \`-c\` option to the above NPM script mentioning \`.storybook\` as the config directory.

    For the basic Storybook configuration file, you don't need to do much, but simply tell Storybook where to find stories.

    To do that, simply create a file at \`.storybook/config.js\` with the following content:

    ~~~js
    import { configure } from '@kadira/storybook';

    function loadStories() {
      require('../stories/index.js');
      // You can require as many stories as you need.
    }

    configure(loadStories, module);
    ~~~

    That'll load stories in \`../stories/index.js\`.

    Just like that, you can load stories from wherever you want to.

    ## Write your stories

    Now you can write some stories inside the \`../stories/index.js\` file, like this:

    ~~~js
    import React from 'react';
    import { storiesOf, action } from '@kadira/storybook';

    storiesOf('Button', module)
      .add('with text', () => (
        <button onClick={action('clicked')}>Hello Button</button>
      ))
      .add('with some emoji', () => (
        <button onClick={action('clicked')}>😀 😎 👍 💯</button>
      ));
    ~~~

    Story is a single state of your component. In the above case, there are two stories for the native button component:

    1. with text
    2. with some emoji

    ## Run your Storybook

    Now everything is ready. Simply run your storybook with:

    ~~~js
    npm run storybook
    ~~~

    Then you can see all your stories, like this:

    ![](${images.basicsStories})

    Now you can change components and write stories whenever you need to. You'll get those changes into Storybook in a snap with the help of Webpack's HMR API.
  `,
};
