import { storiesOf } from '@storybook/polymer';

storiesOf('Addon|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  })
  .add('button with text', () => '<button>Click me</button>');
