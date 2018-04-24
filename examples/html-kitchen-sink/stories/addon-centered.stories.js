import { storiesOf } from '@storybook/html';
import centered from '@storybook/addon-centered/html';

storiesOf('Addons|Centered', module)
  .addDecorator(centered)
  .add('button in center', () => '<button>I am a Button !</button>');
