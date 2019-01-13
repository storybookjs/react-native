import styled from '@emotion/styled';

import { Link } from '../router/router';

export const Frame = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  border: '0 none',
  transition: 'transform .2s ease-out, height .2s ease-out, width .2s ease-out',
  transformOrigin: 'top left',
  overflow: 'auto',

  '& > iframe': {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export const FrameWrap = styled.div(({ offset }) => ({
  position: 'absolute',
  overflow: 'auto',
  left: 0,
  right: 0,
  bottom: 0,
  top: offset,
  zIndex: 3,
  height: offset ? `calc(100% - ${offset}px)` : '100%',
  background: 'transparent',
}));

export const UnstyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'inherit',
  display: 'inline-block',
});
