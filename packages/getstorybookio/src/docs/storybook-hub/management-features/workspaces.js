import { stripIndent } from 'common-tags';

export default {
  id: 'workspaces',
  title: 'Workspaces',
  content: stripIndent`
    We group apps on storybook based on workspaces. Every account on Storybook Hub has a workspace.
    Each workspaces has:

      * It's own set of app
      * A set of collaborators
      * Isolated payment setup

    You'll have access to more workspaces as you are added as a collaborator. Then you can see apps from those workspaces as well.

    > Currently, we don't allow the creation of additional workspaces. But we'll be adding that feature soon.
  `,
};
