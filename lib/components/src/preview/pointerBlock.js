import styled from 'react-emotion';

const PointerBlock = styled('span')(({ shown }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  zIndex: shown ? 2 : 0,
  background: 'rgba(255,255,255,0.05)',
}));

export { PointerBlock };
