import { stripIndent } from 'common-tags';

import commentsInsideStorybookImage from './static/comments-inside-storybook.png';

export default {
  id: 'comments',
  title: 'Comments',
  content: stripIndent`
    You can comment inside Storybooks and discuss with your team. Comments are namespaced based on the git branch.
    So, any storybook associated with a particular branch has the same set of comments.

    ![Comment Inside Storybook](${commentsInsideStorybookImage})

    Adding comments support is easy. Add following NPM packages into your app:

    ~~~sh
    npm i -D @kadira/storybook-database-cloud
    npm i -D @kadira/storybook-addon-comments
    ~~~

    Then add following code into your \`addons.js\` file in \`.storybook\` directory.

    ~~~js
    // To get built in addons.
    import '@kadira/storybook/addons';

    import '@kadira/storybook-database-cloud/register';
    import '@kadira/storybook-addon-comments/register';
    ~~~

    Then push this into GitHub. Now you could comment inside your storybooks.

    ## Access Comments Locally

    You can also access comments even locally. For that, your project needs to have few requirements:


    * Make sure it has a correct GIT remote called origin points to your repo on GitHub
    * Make sure you are on the correct branch.

    Then you'll be able to access these comments. You'll be asked to login to storybook Hub, if needed, right from your comments panel.
  `,
};
