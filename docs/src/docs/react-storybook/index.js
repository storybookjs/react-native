export default [
  {
    id: 'basics',
    heading: 'Basics',
    items: [
      require('./basics/introduction').default,
      require('./basics/quick-start-guide').default,
      require('./basics/slow-start-guide').default,
      require('./basics/writing-stories').default,
      require('./basics/exporting-storybook').default,
      require('./basics/faq').default,
    ],
  },
  {
    id: 'configurations',
    heading: 'Configurations',
    items: [
      require('./configurations/default-config').default,
      require('./configurations/custom-webpack-config').default,
      require('./configurations/custom-babel-config').default,
      require('./configurations/add-custom-head-tags').default,
      require('./configurations/serving-static-files').default,
      require('./configurations/env-vars').default,
      require('./configurations/cli-options').default,
    ],
  },
  {
    id: 'testing',
    heading: 'Testing',
    items: [
      require('./testing/react-ui-testing').default,
      require('./testing/structural-testing').default,
      require('./testing/interaction-testing').default,
      require('./testing/css-style-testing').default,
      require('./testing/manual-testing').default,
    ],
  },
  {
    id: 'addons',
    heading: 'Addons',
    items: [
      require('./addons/introduction').default,
      require('./addons/using-addons').default,
      require('./addons/addon-gallery').default,
      require('./addons/writing-addons').default,
      require('./addons/api').default,
    ],
  },
];
