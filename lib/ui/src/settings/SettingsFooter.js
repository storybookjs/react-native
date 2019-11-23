import React from 'react';

import { styled } from '@storybook/theming';
import { Link } from '@storybook/components';

const Footer = styled.div(({ theme }) => ({
  display: 'flex',
  paddingTop: 20,
  marginTop: 20,
  borderTop: `1px solid ${theme.appBorderColor}`,
  fontWeight: theme.typography.weight.bold,

  '& > * + *': {
    marginLeft: 20,
  },
}));
const SettingsFooter = props => (
  <Footer {...props}>
    <Link secondary href="https://storybook.js.org" cancel={false} target="_blank">
      Docs
    </Link>
    <Link secondary href="https://github.com/storybookjs/storybook" cancel={false} target="_blank">
      GitHub
    </Link>
    <Link secondary href="https://storybook.js.org/support" cancel={false} target="_blank">
      Support
    </Link>
  </Footer>
);

export default SettingsFooter;
