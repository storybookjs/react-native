import { styled } from '@storybook/theming';

export const TabButton = styled.button(
  {
    whiteSpace: 'normal',
    display: 'inline-flex',
    overflow: 'hidden',
    verticalAlign: 'top',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',

    '&:empty': {
      display: 'none',
    },
  },
  ({ theme }) => ({
    padding: '0 15px',
    textTransform: 'capitalize',
    transition: 'color 0.2s linear, border-bottom-color 0.2s linear',
    height: 40,
    lineHeight: '12px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    background: 'transparent',
    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',
    fontWeight: 'bold',

    '&:focus': {
      outline: '0 none',
      borderBottomColor: theme.colors.highlight,
    },
  }),
  ({ active, theme }) =>
    active
      ? {
          color: theme.barSelectedColor,
          borderBottomColor: theme.barSelectedColor,
        }
      : {
          color: theme.dimmedTextColor,
          borderBottomColor: 'transparent',
        }
);
TabButton.displayName = 'TabButton';

export const IconButton = styled.button(
  ({ theme }) => ({
    height: 40,
    background: 'none',
    color: 'inherit',
    padding: 0,
    cursor: 'pointer',

    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',

    transition: 'color 0.2s linear, border-bottom-color 0.2s linear',

    '&:hover, &:focus': {
      outline: '0 none',
      color: theme.colors.highlight,
    },
    '& > svg': {
      width: 15,
    },
  }),
  ({ active, theme }) =>
    active
      ? {
          outline: '0 none',
          borderBottomColor: theme.colors.highlight,
        }
      : {}
);
IconButton.displayName = 'IconButton';
