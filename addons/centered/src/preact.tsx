/** @jsx h */
import { Component, h } from 'preact';
import styles from './styles';

export default function(storyFn: () => Component) {
  return (
    <div style={styles.style}>
      <div style={styles.innerStyle}>{storyFn()}</div>
    </div>
  );
}
