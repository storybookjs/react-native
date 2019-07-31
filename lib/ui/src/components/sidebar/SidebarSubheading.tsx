import React from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';

export type SubheadingProps = React.ComponentProps<'div'>;

const Subheading = styled.div<SubheadingProps>(({ theme }) => ({
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s1 - 1,
  lineHeight: '24px',
  color: transparentize(0.5, theme.color.defaultText),
}));

// issue #6098
Subheading.defaultProps = {
  className: 'sidebar-subheading',
};

export default Subheading;
