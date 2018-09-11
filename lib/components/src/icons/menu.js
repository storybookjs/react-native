import React from 'react';

import Svg from './util/svg';

const Menu = props => (
  <Svg height="24" width="24" viewBox="0 0 24 24" {...props}>
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
  </Svg>
);

export { Menu as default };
