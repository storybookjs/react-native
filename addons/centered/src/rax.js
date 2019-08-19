/** @jsx createElement */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createElement } from 'rax';
// eslint-disable-next-line import/no-extraneous-dependencies
import View from 'rax-view';
import { makeDecorator } from '@storybook/addons/src/make-decorator';
import parameters from './parameters';
import styles from './styles';

function centered(storyFn) {
  return (
    <View style={styles.style}>
      <View style={styles.innerStyle}>{storyFn()}</View>
    </View>
  );
}

export default makeDecorator({
  ...parameters,
  wrapper: centered,
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
