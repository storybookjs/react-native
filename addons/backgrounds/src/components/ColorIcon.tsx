import { styled } from '@storybook/theming';

export const ColorIcon = styled.span(({ background }: { background: string }) => ({
  borderRadius: '1rem',
  display: 'block',
  height: '1rem',
  width: '1rem',
  background,
}));
