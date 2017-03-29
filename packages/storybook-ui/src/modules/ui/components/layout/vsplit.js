import React from 'react';

const wrapStyle = {
  cursor: 'col-resize',
  height: '100%',
  width: '20px',
  marginLeft: '-10px',
  position: 'relative',
};

const spanStyle = {
  width: '1px',
  height: '20px',
  right: '5px',
  top: '50%',
  marginTop: '-10px',
  position: 'absolute',
  borderLeft: 'solid 1px rgba(0,0,0,0.1)',
  borderRight: 'solid 1px rgba(0,0,0,0.1)',
};

const VSplit = () => (
  <div style={wrapStyle}>
    <span style={spanStyle}></span>
  </div>
);

export default VSplit;
