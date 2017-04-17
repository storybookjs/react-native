import { stripIndent } from 'common-tags';

export default {
  id: 'quick-start-guide',
  title: 'Quick Start Guide',
  content: stripIndent`
    React Storybook is very easy to use. You can use it with any kind of React project.
    Follow these steps to get started with Storybook.

    ~~~sh
    npm i -g getstorybook
    cd my-react-app
    getstorybook
    ~~~

    This will configure your app for Storybook. After that, you can run your Storybook with:

    ~~~
    npm run storybook
    ~~~

    Then you can access your storybook from the browser.

    ---

    To learn more about what \`getstorybook\` command does, have a look at our [Slow Start Guide](/docs/react-storybook/basics/slow-start-guide).
  `,
};
