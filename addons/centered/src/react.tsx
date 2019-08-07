import React, { ReactNode } from 'react';
import { makeDecorator, StoryFn } from '@storybook/addons';
import styles from './styles';

function centered(storyFn: () => ReactNode) {
  return (
    <div style={styles.style}>
      <div style={styles.innerStyle}>{storyFn()}</div>
    </div>
  );
}

export default makeDecorator({
  name: 'centered',
  parameterName: 'centered',
  wrapper: getStory => centered(getStory as StoryFn),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
