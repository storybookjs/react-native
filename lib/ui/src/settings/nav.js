import React from 'react';
import styled from 'react-emotion';

import { Explorer } from '@storybook/components';
import { Link } from '../router';

const LeafLink = styled('div')(
  {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  ({ isSelected }) => ({
    background: isSelected ? '#CFD8DC' : 'transparent',
  })
);

const idToPath = {
  about: '/settings/about',
  shortcuts: '/settings/shortcuts',
};

const SettingsPanel = () => (
  <div>
    <Explorer
      stories={[
        {
          name: 'About storybook',
          id: 'about',
        },
        {
          name: 'Keyboard shortcuts',
          id: 'shortcuts',
        },
      ]}
      // TODO: need a way to just pass a render function for inner leaf aka replace {name} by renderItem() in DefaultLeafNode
      // Also necessary to pass metadata from the stories to the render functions to avoid the idToPath map
      Leaf={({ id, name, isSelected }) => (
        <LeafLink>
          <Link to={idToPath[id] || '/settings'}>{name}</Link>
        </LeafLink>
      )}
    />
  </div>
);

export default SettingsPanel;
