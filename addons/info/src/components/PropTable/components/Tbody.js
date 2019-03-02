import PropTypes from 'prop-types';
import React from 'react';

const Tbody = ({ children }) => <tbody>{children}</tbody>;

Tbody.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    .isRequired,
};

export default Tbody;
