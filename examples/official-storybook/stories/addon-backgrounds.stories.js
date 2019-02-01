import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseButton from '../components/BaseButton';

storiesOf('Addons|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'light', value: '#eeeeee' },
      { name: 'gray', value: '#cccccc' },
      { name: 'dark', value: '#222222', default: true },
      { name: 'black', value: '#000000' },
    ],
  })
  .add('story 1', () => (
    <BaseButton label="You should be able to switch backgrounds for this story" />
  ))
  .add('story 2', () => <BaseButton label="This one too!" />)
  .add('overriden', () => <BaseButton label="This one should have different backgrounds" />, {
    backgrounds: [
      { name: 'pink', value: 'hotpink' },
      { name: 'blue', value: 'deepskyblue', default: true },
    ],
  })
  .add('disabled via []', () => <BaseButton label="This one should not use backgrounds" />, {
    backgrounds: [],
  })
  .add(
    'skipped via disable:true',
    () => <BaseButton label="This one should not use backgrounds either" />,
    {
      backgrounds: { disable: true },
    }
  );
