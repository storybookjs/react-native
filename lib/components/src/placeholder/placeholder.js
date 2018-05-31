import styled from 'react-emotion';

import { baseFonts } from '../';

export default styled('p')(baseFonts, {
  fontSize: '11px',
  display: 'block',
  textAlign: 'center',
  textTransform: 'uppercase',
  margin: 0,
  padding: 20,
});
