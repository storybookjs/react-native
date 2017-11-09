import React from 'react';

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

export default Indicator;
