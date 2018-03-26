import React from 'react';
import PropTypes from 'prop-types';

function Text({ children }) {
  return <p>{children}</p>;
}

Text.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Text;
