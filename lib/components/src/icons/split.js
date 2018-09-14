import React from 'react';

import Svg from './util/svg';

const Split = ({ vertical, ...props }) =>
  vertical ? (
    <Svg height="24" width="24" viewBox="0 0 24 24" {...props}>
      <path
        d="M3 15h8v-2H3v2zm0 4h8v-2H3v2zm0-8h8V9H3v2zm0-6v2h8V5H3zm10 0h8v14h-8V5z"
        fill="currentColor"
      />
    </Svg>
  ) : (
    <Svg height="24" width="24" viewBox="0 0 24 24" {...props}>
      <path d="M9 3v8h2V3zM5 3v8h2V3zm8 0v8h2V3zm6 0h-2v8h2zm0 10v8H5v-8z" fill="currentColor" />
    </Svg>
  );

export { Split as default };
