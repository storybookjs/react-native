// From: https://gist.github.com/ivanoats/8d01d9e934fdc17bae9090147f1e799b

const fs = require('fs');
const path = require('path');
const sm = require('sitemap');
const stripIndent = require('common-tags/lib/stripIndent');

function pagesToSitemap(pages) {
  return pages
    .filter(p => !!p.path)
    .map(p => ({
      url: p.path,
      changefreq: 'daily',
      priority: 0.7,
    }));
}

function generateSitemap(pages) {
  const sitemap = sm.createSitemap({
    hostname: 'https://storybook.js.org',
    cacheTime: '60000',
    urls: pagesToSitemap(pages),
  });
  fs.writeFileSync(`${__dirname}/public/sitemap.xml`, sitemap.toString());
}

const generateVersionsFile = () => {
  // TODO: hard-coded for now
  // must be generated from pr-log / CHANGELOG.md
  const data = {
    latest: {
      version: '4.0.0',
      info: {
        plain: stripIndent`
          - upgrade webpack & babel to latest
          - new addParameters and third argument to .add to pass data to addons
          - added the ability to theme storybook
          - improved ui for mobile devices
          - improved performance of addon-knobs
        `,
      },
    },
  };
  fs.writeFileSync(`${__dirname}/public/versions.json`, JSON.stringify(data));
};

module.exports = {
  async onPostBuild({ graphql }) {
    const result = await graphql(`
      {
        allSitePage {
          edges {
            node {
              path
            }
          }
        }
      }
    `);
    generateVersionsFile();
    generateSitemap(result.data.allSitePage.edges.map(({ node }) => node));
  },
  onCreateNode({ node, boundActionCreators, getNode }) {
    const { createNodeField } = boundActionCreators;
    let slug;
    if (node.internal.type === 'MarkdownRemark') {
      const fileNode = getNode(node.parent);
      const parsedFilePath = path.parse(fileNode.relativePath);
      if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
        slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
      } else if (parsedFilePath.dir === '') {
        slug = `/${parsedFilePath.name}/`;
      } else {
        slug = `/${parsedFilePath.dir}/`;
      }

      // Add slug as a field on the node.
      createNodeField({ node, name: 'slug', value: slug });
    }
  },
  async createPages({ graphql, boundActionCreators }) {
    const { createPage } = boundActionCreators;

    const template = path.resolve('src/templates/_docstemplate.jsx');
    // Query for all markdown "nodes" and for the slug we previously created.
    const result = await graphql(
      `
        {
          allMarkdownRemark {
            edges {
              node {
                fields {
                  slug
                }
              }
            }
          }
        }
      `
    );
    if (result.errors) {
      throw result.errors;
    }

    // Create pages.
    result.data.allMarkdownRemark.edges.forEach(edge => {
      createPage({
        path: edge.node.fields.slug, // required
        component: template,
        context: {
          slug: edge.node.fields.slug,
        },
      });
    });
  },
};
