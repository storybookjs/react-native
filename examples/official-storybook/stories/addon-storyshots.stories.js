import React from 'react';
import { storiesOf } from '@storybook/react';
import BaseButton from '../components/BaseButton';

const text = 'Testing the storyshots addon';

storiesOf('Addons|Storyshots', module)
  .add('Default', () => <BaseButton label="" />)
  .add('Label', () => <BaseButton label={text} />)
  .add('Disabled', () => <BaseButton disabled label={text} />);
