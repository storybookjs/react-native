import PropTypes from 'prop-types';
import React from 'react';
import '../style.css';

const Table = ({ children }) => <table className="info-table">{children}</table>;

Table.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    .isRequired,
};

export default Table;
