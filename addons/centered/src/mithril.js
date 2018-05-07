/** @jsx m */

// eslint-disable-next-line import/no-extraneous-dependencies
import m from 'mithril';
import styles from './styles';

export default function(storyFn) {
  return {
    view: () => (
      <div style={styles.style}>
        <div style={styles.innerStyle}>{m(storyFn())}</div>
      </div>
    ),
  };
}
