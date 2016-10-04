import React, { PropTypes } from 'react';

function Text({ children }) {
  return (
    <p>
      {children}
    </p>
  );
}

Text.propTypes = {
  children: PropTypes.any,
};

export default Text;
