import React from 'react';
import base from 'paths.macro';

import BaseButton from '../components/BaseButton';

export const story1 = () => <BaseButton label="Story 1" />;

story1.story = {
  name: 'story 1',
};

export const story2 = () => <BaseButton label="Story 2" />;

story2.story = {
  name: 'story 2',
};
