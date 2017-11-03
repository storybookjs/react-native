import { storiesOf } from '@storybook/polymer';
import '../PlaygroundButton.html';

storiesOf('PlaygroundButton', module).add(
  'default mode',
  () => '<playground-button></playground-button>'
);
