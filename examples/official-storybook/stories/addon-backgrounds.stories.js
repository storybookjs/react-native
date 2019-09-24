import React from 'react';

import BaseButton from '../components/BaseButton';

export default {
  title: 'Addons|Backgrounds',

  parameters: {
    backgrounds: [
      { name: 'white', value: '#ffffff' },
      { name: 'light', value: '#eeeeee' },
      { name: 'gray', value: '#cccccc' },
      { name: 'dark', value: '#222222', default: true },
      { name: 'black', value: '#000000' },
    ],
  },
};

export const story1 = () => (
  <BaseButton label="You should be able to switch backgrounds for this story" />
);

story1.story = {
  name: 'story 1',
};

export const story2 = () => <BaseButton label="This one too!" />;

story2.story = {
  name: 'story 2',
};

export const overridden = () => <BaseButton label="This one should have different backgrounds" />;

overridden.story = {
  parameters: {
    backgrounds: [
      { name: 'pink', value: 'hotpink' },
      { name: 'blue', value: 'deepskyblue', default: true },
    ],
  },
};

export const disabledVia = () => <BaseButton label="This one should not use backgrounds" />;

disabledVia.story = {
  name: 'disabled via []',

  parameters: {
    backgrounds: [],
  },
};

export const skippedViaDisableTrue = () => (
  <BaseButton label="This one should not use backgrounds either" />
);

skippedViaDisableTrue.story = {
  name: 'skipped via disable:true',

  parameters: {
    backgrounds: { disable: true },
  },
};

export const gridCellSize = () => (
  <BaseButton label="This one should have a different grid cell size" />
);

gridCellSize.story = {
  parameters: {
    grid: { cellSize: 10 },
  },
};
