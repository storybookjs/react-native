import { stripIndent } from 'common-tags';

export default {
  id: 'sharing-storybooks',
  title: 'Sharing Storybooks',
  content: stripIndent`
    One of the coolest thing about Storybook Hub is you can share storybooks with anyone even they don't have a GitHub account.

    All of our storybook URLs are permalinks. So, you can share them with anyone you like.
    You could get these URLS either from Github PRs or from Storybook Hub.

    ## Access Control

    ### public apps

    Any storybook URL associated with public apps is available for anyone. Anyone with an account at Storybook Hub could comment on storybooks.

    ### private apps

    For private apps, any collaborator in your workspace could access storybooks for that app.
    You can easily add or remove collaborators by visiting your [workspace](https://hub.getstorybook.io/workspaces).
  `,
};
