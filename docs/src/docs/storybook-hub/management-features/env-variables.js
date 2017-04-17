import { stripIndent } from 'common-tags';

import editAppButtonImage from './static/edit-app-button.png';
import envVarsImage from './static/env-vars.png';

export default {
  id: 'env-variables',
  title: 'Environment Variables',
  content: stripIndent`
    You can pass dynamic information to Storybook via environmental variables. This can be used to pass configurations and secrets. Here's [how to](/docs/react-storybook/configurations/env-vars) use them with storybook.

    As you expected, you can set env variables directly from Storybook Hub. Therefore, you don't need to commit those configuration into GitHub or any other store.

    These configurations are carried with your storybook. Since storybooks for private apps are only available to people you trust, this is a good way to pass secrets to Storybook.

    To set environment variables, click the "Edit" button your app page on Storybook Hub.

    ![Edit App Button](${editAppButtonImage})

    Then you could set environment variables like this:

    ![Set Environment Varibles](${envVarsImage})
  `,
};
