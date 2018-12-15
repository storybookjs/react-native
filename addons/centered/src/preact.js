/** @jsx h */
// eslint-disable-next-line import/no-extraneous-dependencies
import { h } from 'preact';
import styles from './styles';

export default function(storyFn) {
  return (
    <div style={styles.style}>
      <div style={styles.innerStyle}>{storyFn()}</div>
    </div>
  );
}
