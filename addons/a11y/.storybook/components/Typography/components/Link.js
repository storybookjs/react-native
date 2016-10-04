import React, { PropTypes } from 'react';

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
