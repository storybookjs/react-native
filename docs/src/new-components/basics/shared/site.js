// eslint-disable import/prefer-default-export

const gitHubOrg = `https://github.com/storybooks`;
const homepageUrl = `https://storybook.js.org`;
const docsUrl = `${homepageUrl}/docs`;
const npmApiBase = `https://api.npmjs.org/downloads/point/last-month`;

export const metadata = {
  title: 'Storybook',
  description: `Storybook is an open source tool for developing UI components in isolation for React, Vue, and Angular`,
  ogImage: '/images/social/open-graph.png',
  googleSiteVerification: '',
  latestVersion: 'v5.0',
};

export const url = {
  gitHub: {
    repo: `${gitHubOrg}/storybook`,
    frontpage: `${gitHubOrg}/frontpage`,
    issues: `${gitHubOrg}/storybook/issues`,
    releases: `${gitHubOrg}/storybook/releases`,
    contributors: `${gitHubOrg}/storybook/graphs/contributors`,
    brand: `${gitHubOrg}/press`,
  },

  npm: `https://www.npmjs.com/package/@storybook/react`,
  openCollective: `https://opencollective.com/storybook`,

  npmApi: {
    react: `${npmApiBase}/@storybook/react`,
    reactNative: `${npmApiBase}/@storybook/react-native`,
    vue: `${npmApiBase}/@storybook/vue`,
    angular: `${npmApiBase}/@storybook/angular`,
    ember: `${npmApiBase}/@storybook/ember`,
    html: `${npmApiBase}/@storybook/html`,
    svelte: `${npmApiBase}/@storybook/svelte`,
    mithril: `${npmApiBase}/@storybook/mithril`,
    riot: `${npmApiBase}/@storybook/riot`,
    polymer: `${npmApiBase}/@storybook/polymer`,
    preact: `${npmApiBase}/@storybook/preact`,
  },

  // Navigation
  home: `${homepageUrl}`,
  docs: {
    home: `${docsUrl}/basics/introduction/`,
    addonInstruction: `${docsUrl}/addons/writing-addons/`,
  },
  addons: `${homepageUrl}/addons`,
  community: `${homepageUrl}/community`,
  useCases: `${homepageUrl}/use-cases`,
  support: `${homepageUrl}/support`,
  team: `${homepageUrl}/team`,

  // Social
  blog: `https://medium.com/storybookjs`,
  twitter: `https://twitter.com/storybookjs`,
  chat: `https://discord.gg/UUt2PJb`,
  youtube: `https://www.youtube.com/channel/UCr7Quur3eIyA_oe8FNYexfg`,

  // Brand
  brand: `${gitHubOrg}/brand`,
  designSystem: `https://storybooks-official.netlify.com`,
  badge: `${gitHubOrg}/brand/tree/master/badge`,
  presentation: `${gitHubOrg}/brand/tree/master/presentation`,
  video: `${gitHubOrg}/brand/tree/master/video`,

  // Framework docs
  framework: {
    react: `${docsUrl}/guides/guide-react/`,
    reactNative: `${docsUrl}/guides/guide-react-native/`,
    vue: `${docsUrl}/guides/guide-vue/`,
    angular: `${docsUrl}/guides/guide-angular/`,
    ember: `${docsUrl}/guides/guide-ember/`,
    html: `${docsUrl}/guides/guide-html/`,
    svelte: `${docsUrl}/guides/guide-svelte/`,
    mithril: `${docsUrl}/guides/guide-mithril/`,
    riot: `${docsUrl}/guides/guide-riot/`,
  },

  // Official addons
  officialAddons: {
    knobs: `${gitHubOrg}/storybook/tree/master/addons/knobs`,
    actions: `${gitHubOrg}/storybook/tree/master/addons/actions`,
    source: `${gitHubOrg}/storybook/tree/master/addons/storysource`,
    info: `${gitHubOrg}/storybook/tree/master/addons/info`,
    viewport: `${gitHubOrg}/storybook/tree/master/addons/viewport`,
    storyshots: `${gitHubOrg}/storybook/tree/master/addons/storyshots`,
    backgrounds: `${gitHubOrg}/storybook/tree/master/addons/backgrounds`,
    accessibility: `${gitHubOrg}/storybook/tree/master/addons/a11y`,
    console: `${gitHubOrg}/storybook-addon-console`,
    links: `${gitHubOrg}/storybook/tree/master/addons/links`,
  },
};
