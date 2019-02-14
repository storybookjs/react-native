import PropTypes from 'prop-types';
import React from 'react';

const Th = ({ children }) => <th>{children}</th>;

Th.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export default Th;
