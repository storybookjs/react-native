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
  <Explorer
    allowClick
    stories={{
      '1': {
        depth: 0,
        id: 1,
        isSelected: true,
        name: 'About storybook',
        path: '1',
        pid: '',
      },
      '2': {
        depth: 0,
        id: 2,
        name: 'Keyboard Shortcuts',
        path: '2',
        pid: '',
      },
      root: {
        children: ['1', '2'],
      },
    }}
    Link={LeafLink}
  />
);

export default SettingsPanel;
