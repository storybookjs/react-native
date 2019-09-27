import { makeDecorator } from '@storybook/addons';
import parameters from './parameters';
import styles from './styles';

function centered() {
  return {
    template: `
      <div :style="style">
        <div :style="innerStyle">
          <story/>
        </div>
      </div>
    `,
    data() {
      return styles;
    },
  };
}

export default makeDecorator({
  ...parameters,
  wrapper: centered,
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
