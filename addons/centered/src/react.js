// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import styles from './styles';

export default function(storyFn) {
  return (
    <div style={styles.style}>
      <div style={styles.innerStyle}>{storyFn()}</div>
    </div>
  );
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
