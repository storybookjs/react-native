import React from 'react';

import Svg from './util/svg';

const Other = props => (
  <Svg height="24" width="24" viewBox="0 0 24 24" {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </Svg>
);

export { Other as default };
