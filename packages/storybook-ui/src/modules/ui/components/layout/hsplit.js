import React from 'react';

const wrapStyle = {
  width: '100%',
  height: 20,
  marginTop: -28,
  marginBottom: -2,
  position: 'relative',
};

const spanStyle = {
  height: 1,
  width: 20,
  top: 11,
  left: '50%',
  marginLeft: -10,
  position: 'absolute',
  borderTop: 'solid 1px rgba(0,0,0,0.1)',
  borderBottom: 'solid 1px rgba(0,0,0,0.1)',
};

const HSplit = () => (
  <div style={wrapStyle}>
    <span style={spanStyle} />
  </div>
);

export default HSplit;
