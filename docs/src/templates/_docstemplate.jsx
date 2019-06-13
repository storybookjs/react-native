import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import Docs from '../components/Docs';

const categories = [
  {
    id: 'storybook',
    title: 'Storybook',
  },
];

const getSections = (sections, edges) =>
  Object.keys(sections).map(key => ({
    id: key,
    heading: capitalize(key),
    items: sections[key].map(path => {
      const page = edges.find(({ node }) => node.fields.slug === path);
      return page.node.frontmatter;
    }),
  }));

const getSelectedSection = (sections, path) =>
  Object.keys(sections).find(key => sections[key].indexOf(path) >= 0);

const DocsContainer = ({ data }) => {
  const { site, markdownRemark, allMarkdownRemark } = data;
  const { frontmatter, fields, html } = markdownRemark;
  const { id, title } = frontmatter;
  const { slug } = fields;
  const { docSections } = site.siteMetadata;

  const section = getSelectedSection(docSections, slug);

  const docProps = {
    categories,
    sections: getSections(docSections, allMarkdownRemark.edges),
    selectedItem: { id, title, section, content: html },
    selectedSectionId: section,
    selectedItemId: id,
  };

  return <Docs {...docProps} />;
};

const nodeTypeShape = {
  fields: PropTypes.shape({
    section: PropTypes.string,
  }),
  frontmatter: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
  }),
};

DocsContainer.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        docsSections: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
      }),
    }),
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape(nodeTypeShape),
        })
      ),
    }),
    markdownRemark: PropTypes.shape({
      html: PropTypes.string,
      ...nodeTypeShape,
    }),
  }).isRequired,
};
DocsContainer.contextTypes = {
  router: PropTypes.shape({}).isRequired,
};

export default DocsContainer;

export const pageQuery = graphql`
  query Docs($slug: String!) {
    site {
      siteMetadata {
        docSections {
          basics
          guides
          configurations
          testing
          addons
          presets
        }
      }
    }
    allMarkdownRemark {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            id
          }
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        title
        id
      }
    }
  }
`;
