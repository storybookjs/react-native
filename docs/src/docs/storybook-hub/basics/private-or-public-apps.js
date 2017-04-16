import { stripIndent } from 'common-tags';

export default {
  id: 'private-or-public-apps',
  title: 'Private or Public Apps',
  content: stripIndent`
  In Storybook Hub, you could create either private or public apps. This guide will help you choose an app type for your project.

  ## For Open Source Repos

  Most of the time, you may want to create a public app for your repo. Then, anyone could access these storybooks and comment inside them.

  If you need to keep conversation only between your team, you could make a private app for even your open source projects. Then, only your collaborators could access storybooks.

  ## For Private Repos

  You may want to create a private app on Storybook Hub where only you and your collaborators could access storybooks.

  However, you can also create a public app for your private repo. Then you can share storybooks with the public. With this way, anyone in the public could access these URLS and comment on them.

  > Anyway, since your GitHub repo is private, no one in the public will be able to see your storybooks, unless you share them.
  Additionally, our storybook URLs are hard to guess. (They carried an UUID)
    `,
};
