import InfoButton from './InfoButton.vue';

export default {
  title: 'InfoButton',
  component: InfoButton,
};

export const simple = () => ({
  components: { InfoButton },
  template: '<info-button label="I\'m a button!"/>',
});
