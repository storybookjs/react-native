import React from 'react';

const gripSize = 1;
const splitSize = 10;

const wrapStyle = hShift => ({
  width: splitSize,
  marginLeft: hShift - splitSize / 2,
  marginRight: -hShift - splitSize / 2,
  position: 'relative',
  // backgroundColor: 'rgba(255, 0, 0, 0.1)',
});

const spanStyle = {
  width: gripSize,
  height: 20,
  left: splitSize / 2 - (gripSize + 2) / 2,
  top: '50%',
  marginTop: 0,
  position: 'absolute',
  // borderLeft: 'solid 1px rgba(0,0,0,0.1)',
  // borderRight: 'solid 1px rgba(0,0,0,0.1)',
  borderLeft: 'solid 1px rgba(0,0,0,0.1)',
  borderRight: 'solid 1px rgba(0,0,0,0.1)',
};

const VSplit = ({ hShift = 0 }) => (
  <div style={wrapStyle(hShift)}>
    <span style={spanStyle} />
  </div>
);

export default VSplit;
