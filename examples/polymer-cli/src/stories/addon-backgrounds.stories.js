import { storiesOf } from '@storybook/polymer';
import backgrounds from '@storybook/addon-backgrounds';

storiesOf('Addon|Backgrounds', module)
  .addDecorator(
    backgrounds([
      { name: 'twitter', value: '#00aced', default: true },
      { name: 'facebook', value: '#3b5998' },
    ])
  )
  .add('button with text', () => '<button>Click me</button>');
