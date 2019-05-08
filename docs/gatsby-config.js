module.exports = {
  pathPrefix: '/docs',
  siteMetadata: {
    siteTitle: 'Storybook',
    baseColor: '#e64074',
    linkPrefix: '/',

    docSections: {
      basics: [
        '/basics/introduction/',
        '/basics/writing-stories/',
        '/basics/exporting-storybook/',
        '/basics/faq/',
        '/basics/live-examples/',
      ],
      guides: [
        '/guides/quick-start-guide/',
        '/guides/slow-start-guide/',
        '/guides/guide-html/',
        '/guides/guide-react/',
        '/guides/guide-react-native/',
        '/guides/guide-vue/',
        '/guides/guide-angular/',
        '/guides/guide-mithril/',
        '/guides/guide-ember/',
        '/guides/guide-riot/',
        '/guides/guide-svelte/',
      ],
      configurations: [
        '/configurations/options-parameter/',
        '/configurations/default-config/',
        '/configurations/custom-webpack-config/',
        '/configurations/custom-babel-config/',
        '/configurations/typescript-config/',
        '/configurations/add-custom-head-tags/',
        '/configurations/serving-static-files/',
        '/configurations/env-vars/',
        '/configurations/theming/',
        '/configurations/cli-options/',
        '/configurations/standalone-options/',
      ],
      testing: [
        '/testing/react-ui-testing/',
        '/testing/structural-testing/',
        '/testing/interaction-testing/',
        '/testing/automated-visual-testing/',
        '/testing/manual-testing/',
      ],
      addons: [
        '/addons/introduction/',
        '/addons/using-addons/',
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
      resolve: `gatsby-plugin-styled-components`,
      options: {
        repoUrl: 'https://github.com/storybooks/storybook',
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
