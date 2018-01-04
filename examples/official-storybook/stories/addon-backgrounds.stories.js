import React from 'react';
import { storiesOf } from '@storybook/react';

import backgrounds from '@storybook/addon-backgrounds';
import BaseButton from '../components/BaseButton';

storiesOf('Addons|Backgrounds', module)
  .addDecorator(
    backgrounds([
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ])
  )
  .add('story 1', () => (
    <BaseButton label="You should be able to switch backgrounds for this story" />
  ))
  .add('story 2', () => <BaseButton label="This one too!" />);
