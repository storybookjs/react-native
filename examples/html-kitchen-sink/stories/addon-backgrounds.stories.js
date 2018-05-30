import { storiesOf } from '@storybook/html';

import { withBackgrounds } from '@storybook/addon-backgrounds';

storiesOf('Addons|Backgrounds', module)
  .addDecorator(
    withBackgrounds([
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ])
  )
  .add(
    'story 1',
    () =>
      '<span style="color: white">You should be able to switch backgrounds for this story</span>'
  )
  .add('story 2', () => '<span style="color: white">This one too!</span>');
