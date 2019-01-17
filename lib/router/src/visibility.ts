import { styled } from '@storybook/theming';

export const ToggleVisibility = styled.div(({ hidden }) =>
  hidden
    ? {
        display: 'none',
      }
    : {}
);
