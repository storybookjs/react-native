import React from 'react';
import { storiesOf } from '@storybook/react';

import backgrounds, { withBackgrounds } from '@storybook/addon-backgrounds';
import BaseButton from '../components/BaseButton';

storiesOf('Addons|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'black', value: '#000000' },
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
      { name: 'white', value: '#ffffff' },
      { name: 'gray', value: '#cccccc' },
    ],
    options: {
      selectedPanel: 'storybook/background/panel',
    },
  })
  .addDecorator(withBackgrounds)

  .add('story 1', () => (
    <BaseButton label="You should be able to switch backgrounds for this story" />
  ))
  .add('story 2', () => <BaseButton label="This one too!" />)
  .add('overriden', () => <BaseButton label="This one should have different backgrounds" />, {
    backgrounds: [
      { name: 'red', value: '#F44336' },
      { name: 'blue', value: '#2196F3', default: true },
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

storiesOf('Addons|Backgrounds.deprecated', module)
  .addDecorator(
    backgrounds([
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ])
  )
  .add('story 1', () => (
    <BaseButton label="You should be able to switch backgrounds for this story" />
  ))
  .add('story 2', () => <BaseButton label="This one too!" />)
  .add(
    'overriden',
    backgrounds([
      { name: 'red', value: '#F44336' },
      { name: 'blue', value: '#2196F3', default: true },
    ])(() => <BaseButton label="This one should have different backgrounds" />)
  );
