import React from 'react';
import PropTypes from 'prop-types';

function Image({ src, alt, presentation }) {
  return (
    <img
      src={src}
      alt={alt}
      role={presentation && 'presentation'}
    />
  );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  presentation: PropTypes.bool,
};

export default Image;
