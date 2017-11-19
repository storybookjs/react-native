import { storiesOf } from '@storybook/react';
import implementations from './implementations';

const storyGroups = {};

Object.keys(implementations).forEach(key => {
  const [groupName, itemName] = key.split('.');
  const implementation = implementations[key];

  if (!storyGroups[groupName]) {
    storyGroups[groupName] = storiesOf(groupName, module);
  }

  storyGroups[groupName].add(itemName, () => implementation);
});
