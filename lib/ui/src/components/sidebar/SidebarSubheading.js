import React from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';

const Heading = styled.div(({ theme }) => ({
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s1 - 1,
  lineHeight: '24px',
  color: transparentize(0.5, theme.color.defaultText),
}));

const Subheading = props => <Heading {...props} />;

export default Subheading;
