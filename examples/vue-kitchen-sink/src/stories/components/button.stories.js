import MyButton from '../Button.vue';

export default {
  title: 'Button',
  component: MyButton,
};

export const Rounded = () => ({
  components: { MyButton },
  template: '<my-button :rounded="true">A Button with rounded edges</my-button>',
});

export const Square = () => ({
  components: { MyButton },
  template: '<my-button :rounded="false">A Button with square edges</my-button>',
});
