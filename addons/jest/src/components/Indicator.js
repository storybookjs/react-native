import React from 'react';
import PropTypes from 'prop-types';

const Indicator = ({ color, size, children = '', right }) => (
  <div
    style={{
      boxSizing: 'border-box',
      padding: `0 ${size / 2}px`,
      minWidth: size,
      minHeight: size,
      fontSize: size / 1.4,
      lineHeight: `${size}px`,
      color: 'white',
      textTransform: 'uppercase',
      borderRadius: size / 2,
      backgroundColor: color,
      marginLeft: right ? size / 2 : 0,
      marginRight: right ? 0 : size / 2,
    }}
  >
    {children}
  </div>
);

Indicator.defaultProps = {
  right: false,
  children: null,
};

Indicator.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  children: PropTypes.node,
  right: PropTypes.bool,
};

export default Indicator;
