import { storiesOf } from '@storybook/html';

storiesOf('Addons|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  })
  .add(
    'story 1',
    () =>
      '<span style="color: white">You should be able to switch backgrounds for this story</span>'
  )
  .add('story 2', () => '<span style="color: white">This one too!</span>');
