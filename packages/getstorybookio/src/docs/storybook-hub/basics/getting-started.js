import { stripIndent } from 'common-tags';

import authorizeGithubImage from './static/authorize-github.png';
import storybooksViaHubImage from './static/storybooks-via-hub.png';
import storybooksViaPRImage from './static/storybooks-via-pr.png';

export default {
  id: 'getting-started',
  title: 'Getting Started',
  content: stripIndent`
    This guide will help you to connect your React app (or project) to [Storybook Hub](https://hub.getstorybook.io/).

    ## Add Storybook for Your Project

    Most probably, you'll have a storybook configured for your project. If not, follow our [docs](/docs/react-storybook/basics/introduction).
    Then make sure it has a \`build-storybook\` npm script as shown below:

    ~~~js
    {
        "scripts": {
            ...
            "build-storybook": "build-storybook -o ./.out"
            ...
        }
    }
    ~~~

    > Output directory provided with \`-o\` option could be any directory. We'll override it while we are building it.

    ## Create an App on  Storybook Hub

    Then create a Storybook Hub account. Make sure to sign up via GitHub. Otherwise, you won't be able to link your GitHub repo.
    Then follow the screens and create an app.

    Here, you'll be able to authorize Github again to grant more permission.
    If you are looking to only use Storybook Hub for public app, authorize for public apps. Otherwise, authorize for private apps.

    ![Authorize GitHub for Storybook Hub](${authorizeGithubImage})

    > Here, you authorize for your whole account. Not just for this app. So, make sure to do this with caution.
    You could always go from public to private.
    But going from private to public may be an issue if you already have private apps.


    Then select your repo and create an app.

    ## Push Some Code Commits

    Now, everything is ready. Push some code commits and we'll start building storybooks for your apps. We group storybooks by branches. You can access them by visiting your app's page on Storybook Hub.

    ![Access Storybooks via Storybook Hub](${storybooksViaHubImage})

    You can also access these storybooks, right next to your PR.

    ![Access Storybooks via GitHub PR](${storybooksViaPRImage})
  `,
};
