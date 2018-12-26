import { storiesOf } from '@storybook/vue';

storiesOf('Core|Template', module).add(
  'string only',
  () => '<my-button :rounded="false">A Button with square edges</my-button>'
);
