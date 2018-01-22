import React from 'react';
import preval from 'babel-plugin-preval/macro';

import { storiesOf } from '@storybook/react';

import BaseButton from '../components/BaseButton';

const base = preval`module.exports = __dirname.replace(process.cwd() + '/', '')`;

storiesOf(`Other|${base}/Dirname Example`, module)
  .add('story 1', () => <BaseButton label="Story 1" />)
  .add('story 2', () => <BaseButton label="Story 2" />);
