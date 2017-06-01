import React from 'react';
import PropTypes from 'prop-types';

function Link({ href, content }) {
  return (
    <a href={href}>
      { content }
    </a>
  );
}

Link.propTypes = {
  href: PropTypes.string,
  content: PropTypes.string,
};

export default Link;
