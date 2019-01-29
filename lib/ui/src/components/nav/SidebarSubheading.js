import React from 'react';

import { styled } from '@storybook/theming';

const Heading = styled.span(({ theme }) => ({
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s1 - 1,
  color: theme.colors.mediumdark,
}));

const Subheading = props => <Heading {...props} />;

export default Subheading;
