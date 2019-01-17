import React from 'react';

import Svg from './util/svg';

const Other = props => (
  <Svg height="24" width="24" viewBox="0 0 24 24" {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path fill="currentColor" d="M19 13H5v-2h14v2z" />
  </Svg>
);

export { Other as default };
