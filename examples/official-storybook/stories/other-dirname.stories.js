import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseButton from '../components/BaseButton';

const base = __dirname;

storiesOf(`Other|${base}/Dirname Example`, module)
  .add('story 1', () => <BaseButton label="Story 1" />)
  .add('story 2', () => <BaseButton label="Story 2" />);
