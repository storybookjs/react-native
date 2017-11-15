module.exports = {
  siteMetadata: {
    siteTitle: 'Storybook',
    baseColor: '#e64074',
    linkPrefix: '/',

    docSections: {
      basics: [
        '/basics/introduction/',
        '/basics/quick-start-guide/',
        '/basics/slow-start-guide/',
        '/basics/guide-react/',
        '/basics/guide-vue/',
        '/basics/writing-stories/',
        '/basics/exporting-storybook/',
        '/basics/faq/',
        '/basics/community/',
      ],
      configurations: [
        '/configurations/default-config/',
        '/configurations/custom-webpack-config/',
        '/configurations/custom-babel-config/',
        '/configurations/add-custom-head-tags/',
        '/configurations/serving-static-files/',
        '/configurations/env-vars/',
        '/configurations/cli-options/',
      ],
      testing: [
        '/testing/react-ui-testing/',
        '/testing/structural-testing/',
        '/testing/interaction-testing/',
        '/testing/css-style-testing/',
        '/testing/manual-testing/',
      ],
      addons: [
        '/addons/introduction/',
        '/addons/using-addons/',
        '/addons/addon-gallery/',
        '/addons/writing-addons/',
        '/addons/api/',
      ],
    },
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 690,
            },
          },
          'gatsby-remark-autolink-headers',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-plugin-sharp',
  ],
};
