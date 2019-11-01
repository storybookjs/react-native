import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
};

export const rounded = () => ({
  components: { MyButton },
  template: '<my-button :rounded="true">A Button with rounded edges</my-button>',
});

export const square = () => ({
  components: { MyButton },
  template: '<my-button :rounded="false">A Button with square edges</my-button>',
});
