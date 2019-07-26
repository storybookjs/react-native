/** @jsx createElement */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createElement } from 'rax';
// eslint-disable-next-line import/no-extraneous-dependencies
import View from 'rax-view';
import styles from './styles';

export default function(storyFn) {
  return (
    <View style={styles.style}>
      <View style={styles.innerStyle}>{storyFn()}</View>
    </View>
  );
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
