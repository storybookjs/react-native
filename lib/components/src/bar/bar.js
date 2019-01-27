import { styled } from '@storybook/theming';

export const Bar = styled.div(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    background: theme.barFill,
    color: theme.barTextColor,
    overflow: 'auto',
    height: 40,
    position: 'relative',
  }),
  ({ theme, border }) =>
    border
      ? {
          background: `${theme.barFill} linear-gradient(to bottom, transparent calc(100% - 1px), ${
            theme.mainBorderColor
          } calc(100% - 1px))`,
        }
      : {}
);
