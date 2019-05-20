/** @jsx m */
import m, { ComponentTypes } from 'mithril';
import styles from './styles';

export default function(storyFn: () => ComponentTypes) {
  return {
    view: () => (
      <div style={styles.style}>
        <div style={styles.innerStyle}>{m(storyFn())}</div>
      </div>
    ),
  };
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
