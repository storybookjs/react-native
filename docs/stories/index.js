import React from 'react';
import { storiesOf } from '@storybook/react';
import implementations from './implementations';

const storyGroups = {};

for (const key in implementations) {
  const [groupName, itemName] = key.split('.');
  const implementation = implementations[key];

  if (!storyGroups[groupName]) {
    storyGroups[groupName] = storiesOf(groupName, module);
  }

  storyGroups[groupName].add(itemName, () => implementation);
}
