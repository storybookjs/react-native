import PropTypes from 'prop-types';
import React from 'react';

const Tr = ({ children }) => <tr>{children}</tr>;

Tr.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Tr;
