import React from 'react';

import Svg from './util/svg';

const Check = props => (
  <Svg height="24" width="24" viewBox="0 0 24 24" {...props}>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
  </Svg>
);

export { Check as default };
