/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

const DocsTemplate = ({ data }) => {
  const post = data.markdownRemark;

  return (
    <div>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
};

DocsTemplate.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      html: PropTypes.string,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default DocsTemplate;

export const pageQuery = graphql`
  query DocsBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
