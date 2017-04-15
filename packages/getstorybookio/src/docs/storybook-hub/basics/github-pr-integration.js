import { stripIndent } from 'common-tags';

import githubPRCommentImage from './static/github-pr-comment.png';
import githubPRDeployLinkImage from './static/github-pr-deploy-link.png';

export default {
  id: 'github-pr-integration',
  title: 'GitHub PR Integration',
  content: stripIndent`
    We'll create Storybooks for every code commit in your app. You can also access them alongside your Github Pull Requests.

    For every full request, we'll add a comment like this:

    ![Storybooks via GitHub PR Comment](${githubPRCommentImage})

    Here you'll get an URL to the latest version of the storybook for this branch. It's a fixed URL for your PR.
    So, you can share it with anyone.

    You can even access storybooks for individual commits. They are listed just below the code commit like this:

    ![Storybooks via GitHub Deploy Link](${githubPRDeployLinkImage})

    You can access all these storybooks by visiting your app's page on Storybook Hub as well. We arrange them according to your branches.
      `,
};
