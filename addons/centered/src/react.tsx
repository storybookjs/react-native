import React, { ReactNode } from 'react';
import styles from './styles';

export default function(storyFn: () => ReactNode) {
  return (
    <div style={styles.style}>
      <div style={styles.innerStyle}>{storyFn()}</div>
    </div>
  );
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
