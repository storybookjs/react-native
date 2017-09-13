import React from 'react';

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto',
};

const innerStyle = {
  margin: 'auto',
};

export default function(storyFn) {
  return (
    <div style={style}>
      <div style={innerStyle}>{storyFn()}</div>
    </div>
  );
}
