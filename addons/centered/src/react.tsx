/* eslint-disable import/no-extraneous-dependencies */
import React, { ReactNode } from 'react';
import { makeDecorator, StoryFn } from '@storybook/addons';
import parameters from './parameters';
import styles from './styles';

function centered(storyFn: () => ReactNode) {
  return (
    <div style={styles.style}>
      <div style={styles.innerStyle}>{storyFn()}</div>
    </div>
  );
}

export default makeDecorator({
  ...parameters,
  wrapper: getStory => centered(getStory as StoryFn),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
