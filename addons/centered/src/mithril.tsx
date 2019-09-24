/** @jsx m */
/* eslint-disable import/no-extraneous-dependencies */
import m, { ComponentTypes } from 'mithril';
import { makeDecorator } from '@storybook/addons';
import parameters from './parameters';
import styles from './styles';

function centered(storyFn: () => ComponentTypes) {
  return {
    view: () => (
      <div style={styles.style}>
        <div style={styles.innerStyle}>{m(storyFn())}</div>
      </div>
    ),
  };
}

export default makeDecorator({
  ...parameters,
  wrapper: getStory => centered(getStory as any),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
