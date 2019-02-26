import PropTypes from 'prop-types';
import React from 'react';

const Thead = ({ children }) => <thead>{children}</thead>;

Thead.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    .isRequired,
};

export default Thead;
