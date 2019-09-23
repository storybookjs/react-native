/** @jsx h */
/* eslint-disable import/no-extraneous-dependencies */
import { Component, h } from 'preact';
import { makeDecorator } from '@storybook/addons';
import parameters from './parameters';
import styles from './styles';

function centered(storyFn: () => Component) {
  return (
    <div style={styles.style}>
      <div style={styles.innerStyle}>{storyFn()}</div>
    </div>
  );
}

export default makeDecorator({
  ...parameters,
  wrapper: getStory => centered(getStory as any),
});
