import PropTypes from 'prop-types';
import React from 'react';

const Tr = ({ children }) => <tr>{children}</tr>;

Tr.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    .isRequired,
};

export default Tr;
