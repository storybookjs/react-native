import React from 'react';
import styled from '@emotion/styled';

import { Explorer } from '@storybook/components';
import { Link } from '../router';

const idToPath = id => {
  const map = {
    about: '/settings',
    shortcuts: '/settings/shortcuts',
  };
  return map[id.replace('treeview_explorer-', '')] || '/settings';
};

const LeafLink = styled(({ id, children, className, ...rest }) => (
  <Link id={id} className={className} to={idToPath(id)} {...rest}>
    {children}
  </Link>
))({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
});

// TODO: should have initial isSelected
const SettingsPanel = () => (
  <div>
    <Explorer
      allowClick
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
      Link={LeafLink}
    />
  </div>
);

export default SettingsPanel;
