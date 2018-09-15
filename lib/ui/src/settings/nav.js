import React from 'react';
import styled from '@emotion/styled';

import { Explorer } from '@storybook/components';
import { Link } from '../router';

const LeafLink = ({ url, children, ...rest }) => (
  <Link to={url} {...rest}>
    {children}
  </Link>
);

const StyledLeafLink = styled(LeafLink)({
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
      about: {
        url: '/settings',
        depth: 0,
        id: 'about',
        isSelected: true,
        name: 'About storybook',
        path: 'about',
        pid: '',
      },
      shortcuts: {
        url: '/settings/shortcuts',
        depth: 0,
        id: 'shortcuts',
        name: 'Keyboard Shortcuts',
        path: 'shortcuts',
        pid: '',
      },
      root: {
        children: ['about', 'shortcuts'],
      },
    }}
    Link={StyledLeafLink}
  />
);

export default SettingsPanel;
