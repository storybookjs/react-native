import React from 'react';
import PropTypes from 'prop-types';

function Link({ href, content }) {
  return <a href={href}>{content}</a>;
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Link;
