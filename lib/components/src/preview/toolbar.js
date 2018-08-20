import React from 'react';
import styled from 'react-emotion';

export const ZoomInIcon = () => <span>+</span>;
export const ZoomOutIcon = () => <span>-</span>;
export const IconButton = styled('button')({
  width: 40,
  height: 40,
  background: 'none',
  border: '0 none',
  color: 'inherit',
});

const Side = styled('div')(
  {
    display: 'flex',
  },
  ({ flex }) =>
    flex
      ? {
          flex: 1,
        }
      : {}
);

const Size = styled('div')(({ theme }) => ({
  fontSize: 11,
  lineHeight: '40px',
  marginRight: 5,
  borderRight: theme.mainBorder,
  paddingRight: 10,
}));

const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  height: 40,
  width: '100%',
  boxSizing: 'border-box',
  borderBottom: theme.mainBorder,
  background: theme.barFill,
  color: theme.mainTextColor,
  zIndex: 2,
  '& > *': {
    marginLeft: 20,
  },
  '& > *:first-child': {
    marginLeft: 0,
  },
}));

const Toolbar = ({ left = null, right = null }) => (
  <Wrapper>
    <Side flex>{left}</Side>
    <Side>{right}</Side>
  </Wrapper>
);

const Address = styled('input')(({ theme }) => ({
  background: theme.mainFill,
  border: theme.mainBorder,
  borderRadius: theme.mainBorderRadius,
  color: theme.mainTextColor,
  margin: 5,
  height: 30,
  paddingLeft: 15,
  paddingRight: 15,
  lineHeight: '30px',
  width: '100%',
  overflow: 'auto',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

const Zoom = ({ current, set }) => (
  <Side>
    <Size>
      ({parseFloat(100 / current).toFixed(0)}
      %)
    </Size>
    <IconButton onClick={() => set(0.8)}>
      <ZoomInIcon />
    </IconButton>
    <IconButton onClick={() => set(1.25)}>
      <ZoomOutIcon />
    </IconButton>
  </Side>
);

export { Toolbar, Zoom, Address };
