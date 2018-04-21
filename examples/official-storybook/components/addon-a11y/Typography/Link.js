import React from 'react';
import PropTypes from 'prop-types';

function Link({ href, content }) {
  return <a href={href}>{content}</a>;
}

Link.propTypes = {
  href: PropTypes.string,
  content: PropTypes.string,
};

Link.defaultProps = {
  href: null,
  content: null,
};

export default Link;
