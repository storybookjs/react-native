import MyButton from './Button.vue';

export default {
  title: 'Custom|Decorator for Vue',
  decorators: [
    storyFn => {
      // Decorated with story-function
      const WrapButton = storyFn();
      return {
        components: { WrapButton },
        template: '<div :style="{ border: borderStyle }"><wrap-button/></div>',
        data() {
          return { borderStyle: 'medium solid red' };
        },
      };
    },
    () => ({
      // Decorated with `story` component
      template: '<div :style="{ border: borderStyle }"><story/></div>',
      data() {
        return {
          borderStyle: 'medium solid blue',
        };
      },
    }),
  ],
};

export const template = () => ({
  template: '<my-button>MyButton with template</my-button>',
});

export const render = () => ({
  render(h) {
    return h(MyButton, { props: { color: 'pink' } }, ['renders component: MyButton']);
  },
});
