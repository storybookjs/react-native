import MyButton from './Button.vue';

export default {
  title: 'Custom|Decorator for Vue',
  decorators: [
    storyFn => {
      // Decorated with story-function
      const WrapButton = storyFn({ customContext: 52, parameters: { customParameter: 42 } });
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

export const withData = ({ parameters, hooks, ...rest }) => ({
  template: `<pre>${JSON.stringify({ ...rest, parameters }, null, 2)}</pre>`,
});

export const render = () => ({
  render(h) {
    return h(MyButton, { props: { color: 'pink' } }, ['renders component: MyButton']);
  },
});
