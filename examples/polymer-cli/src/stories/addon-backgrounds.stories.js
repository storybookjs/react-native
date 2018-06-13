import { storiesOf } from '@storybook/polymer';
import { withBackgrounds } from '@storybook/addon-backgrounds';

storiesOf('Addon|Backgrounds', module)
  .addDecorator(
    withBackgrounds([
      { name: 'twitter', value: '#00aced', default: true },
      { name: 'facebook', value: '#3b5998' },
    ])
  )
  .add('button with text', () => '<button>Click me</button>');
