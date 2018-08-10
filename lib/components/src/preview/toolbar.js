import React from 'react';
import styled from 'react-emotion';

const ZoomInIcon = () => <span>+</span>;
const ZoomOutIcon = () => <span>-</span>;
const IconButton = styled('button')({
  width: 40,
  height: 40,
  background: 'none',
  border: '0 none',
});

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  height: 40,
  boxSizing: 'border-box',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  background: '#fff',
  zIndex: 2,
});

const Toolbar = ({ children, onZoomChange }) => (
  <Wrapper>
    {children}
    <IconButton onClick={() => onZoomChange(0.8)}>
      <ZoomInIcon />
    </IconButton>
    <IconButton onClick={() => onZoomChange(1.25)}>
      <ZoomOutIcon />
    </IconButton>
  </Wrapper>
);

export { Toolbar };
