import React from 'react';
import { storiesOf } from '@kadira/storybook';
import WithDesign from './with_design';
import { WithNote } from '../../.storybook/notes_addon';
import designs from './designs';
import implementations from './implementations';

const storyGroups = {};

for (const key in designs) {
  const [groupName, itemName] = key.split('.');
  const info = designs[key];
  const implementation = implementations[key];

  if (!storyGroups[groupName]) {
    storyGroups[groupName] = storiesOf(groupName, module);
  }

  storyGroups[groupName].add(itemName, () => (
    <WithNote note={info.note}>
      <WithDesign design={info.design}>
        {implementation}
      </WithDesign>
    </WithNote>
  ));
}
