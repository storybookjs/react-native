export default [
  {
    id: 'basics',
    heading: 'Basics',
    items: [
      require('./basics/getting-started').default,
      require('./basics/github-pr-integration').default,
      require('./basics/comments').default,
      require('./basics/private-or-public-apps').default,
      require('./basics/security').default,
    ],
  },

  {
    id: 'management-features',
    heading: 'Management Features',
    items: [
      require('./management-features/workspaces').default,
      require('./management-features/sharing-storybooks').default,
      require('./management-features/env-variables').default,
      require('./management-features/private-npm-packages').default,
    ],
  },
];
