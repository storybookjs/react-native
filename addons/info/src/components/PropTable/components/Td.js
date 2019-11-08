import PropTypes from 'prop-types';
import React from 'react';
import '../style.css';

const Td = ({ isMonospace, children }) => (
  <td className={isMonospace ? 'info-table-monospace' : null}>{children}</td>
);

Td.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.element),
  ]),
  isMonospace: PropTypes.bool,
};

Td.defaultProps = {
  isMonospace: false,
  children: null,
};

export default Td;
