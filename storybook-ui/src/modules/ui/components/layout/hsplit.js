import React from 'react';

const wrapStyle = {
  cursor: 'row-resize',
  width: '100%',
  height: '10px',
  marginTop: '-8px',
  marginBottom: '-10px',
  position: 'relative',
};

const spanStyle = {
  height: '1px',
  width: '20px',
  top: '5px',
  left: '50%',
  marginLeft: '-10px',
  position: 'absolute',
  borderTop: 'solid 1px rgba(0,0,0,0.1)',
  borderBottom: 'solid 1px rgba(0,0,0,0.1)',
};

const HSplit = () => (
  <div style={wrapStyle}>
    <span style={spanStyle}></span>
  </div>
);

export default HSplit;
