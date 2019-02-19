import { storiesOf } from '@storybook/vue';

import MyButton from './Button.vue';

storiesOf('Custom|Decorator for Vue', module)
  .addDecorator(fn => {
    // Decorated with story-function
    const WrapButton = fn();
    return {
      components: { WrapButton },
      template: '<div :style="{ border: borderStyle }"><wrap-button/></div>',
      data() {
        return { borderStyle: 'medium solid red' };
      },
    };
  })
  .addDecorator(() => ({
    // Decorated with `story` component
    template: '<div :style="{ border: borderStyle }"><story/></div>',
    data() {
      return {
        borderStyle: 'medium solid blue',
      };
    },
  }))
  .add('template', () => ({
    template: '<my-button>MyButton with template</my-button>',
  }))
  .add('render', () => ({
    render(h) {
      return h(MyButton, { props: { color: 'pink' } }, ['renders component: MyButton']);
    },
  }));
