import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'React Native Storybook',
  tagline: 'Storybook for React Native',
  favicon: 'img/favicon.ico',

  future: {
    experimental_faster: true,
    v4: true,
  },

  // storybookjs/react-native
  // Set the production url of your site here
  url: 'https://storybookjs.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/react-native',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'storybookjs', // Usually your GitHub org/user name.
  projectName: 'react-native', // Usually your repo name.

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // TODO: Add editUrl
          editUrl: ({ docPath }) => {
            return `https://github.com/storybookjs/react-native/blob/next/docs/docs/${docPath}`;
          },
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          //
          // TODO: Add editUrl
          editUrl: ({ blogPath }) => {
            return `https://github.com/storybookjs/react-native/blob/next/docs/blog/${blogPath}`;
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.jpg',
    // SEO metadata
    metadata: [
      {
        name: 'description',
        content:
          'Storybook for React Native - Build bulletproof UI components faster. Develop, test, and document React Native components in isolation.',
      },
      {
        name: 'keywords',
        content:
          'react native, storybook, component development, ui testing, documentation, mobile development',
      },
      { name: 'author', content: 'Storybook' },
      { name: 'robots', content: 'index, follow' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'React Native Storybook' },
      {
        property: 'og:description',
        content: 'Storybook for React Native - Build bulletproof UI components faster',
      },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@storybookjs' },
      { name: 'twitter:creator', content: '@storybookjs' },
      {
        name: 'twitter:description',
        content: 'Storybook for React Native - Build bulletproof UI components faster',
      },
    ],

    navbar: {
      title: 'React Native Storybook',
      logo: {
        alt: 'React Native Storybook Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/storybookjs/react-native',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Content',
          items: [
            {
              label: 'Docs',
              to: '/docs/intro',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/sMFvFsG',
            },
            {
              label: 'X',
              href: 'https://x.com/storybookjs',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/storybookjs/react-native',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Daniel Williams.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
