import React from 'react';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';

import { DocumentFormatting } from '../typography/DocumentFormatting';

const breakpoint = 600;
const pageMargin = '5.55555';

export interface DocsPageProps {
  title: string;
  subtitle?: string;
}

const Title = styled.h1<{}>(({ theme }) => ({
  // overrides h1 in DocumentFormatting
  '&&': {
    fontSize: theme.typography.size.m3,
    lineHeight: '32px',

    [`@media (min-width: ${breakpoint * 1}px)`]: {
      fontSize: theme.typography.size.l1,
      lineHeight: '36px',
    },
  },
}));

const Subtitle = styled.h2<{}>(({ theme }) => ({
  // overrides h2 in DocumentFormatting
  '&&': {
    fontWeight: theme.typography.weight.regular,
    fontSize: theme.typography.size.s3,
    lineHeight: '20px',
    borderBottom: 'none',
    marginBottom: '15px',

    [`@media (min-width: ${breakpoint * 1}px)`]: {
      fontSize: theme.typography.size.m1,
      lineHeight: '28px',
      marginBottom: '25px',
    },
  },

  color:
    theme.base === 'light'
      ? transparentize(0.25, theme.color.defaultText)
      : transparentize(0.25, theme.color.defaultText),
}));

export const DocsContent = styled(DocumentFormatting)({
  maxWidth: 800,
  width: '100%',
});

export const DocsWrapper = styled.div<{}>(({ theme }) => ({
  background: theme.background.content,
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '4rem 20px',

  [`@media (min-width: ${breakpoint * 1}px)`]: {},
}));

export const DocsPageWrapper: React.FunctionComponent = ({ children }) => (
  <DocsWrapper>
    <DocsContent>{children}</DocsContent>
  </DocsWrapper>
);

/**
 * An out-of-the box documentation page for components that shows the
 * title & subtitle and a collection of blocks including `Description`,
 * and `Preview`s for each of the component's stories.
 */
const DocsPage: React.FunctionComponent<DocsPageProps> = ({ title, subtitle, children }) => (
  <>
    {title && <Title>{title}</Title>}
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
    {children}
  </>
);

export { DocsPage };
