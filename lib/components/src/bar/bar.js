import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

const Side = styled.div(
  {
    display: 'flex',
    flexBasis: 'auto',
    flexShrink: 0,
  },
  ({ left }) =>
    left
      ? {
          '& > *': {
            marginLeft: 15,
          },
        }
      : {},
  ({ right }) =>
    right
      ? {
          marginLeft: 30,
          '& > *': {
            marginRight: 15,
          },
        }
      : {}
);
Side.displayName = 'Side';

export const Bar = styled.div(
  ({ theme }) => ({
    color: theme.barTextColor,
    height: 40,
  }),
  ({ theme, scroll = true }) =>
    scroll
      ? {
          overflow: 'auto',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: ['slim', 3],
          scrollbarColor: 'transparent transparent',

          '&:hover': {
            scrollbarWidth: ['none', 0],
          },

          '&::-webkit-scrollbar': {
            height: 3,
            width: 3,
            background: 'transparent',
            boxShadow: 'none',
            display: 'none',
          },
          '&:hover::-webkit-scrollbar': {
            height: 3,
            width: 3,
            background: 'transparent',
            display: 'block',
          },

          '&::-webkit-scrollbar-track': {
            borderRadius: 0,
            background: 'transparent',
            opacity: 0,
            border: '0 none',
            boxShadow: 'none',
            height: 0,
            width: 0,
          },

          '&::-webkit-scrollbar-thumb': {
            borderRadius: 0,
            background: theme.color.border,
            boxShadow: 'none',
          },
          '&::-webkit-scrollbar-track-piece': {
            display: 'none',
            border: '0 none',
            opacity: 0,
            visibility: 'hidden',
          },
        }
      : {
          overflow: 'visible',
          overflowX: 'visible',
          overflowY: 'visible',
        },
  ({ theme, border }) =>
    border
      ? {
          background: `${theme.barBg} linear-gradient(to bottom, transparent calc(100% - 1px), ${
            theme.appBorderColor
          } calc(100% - 1px))`,
        }
      : {}
);
Bar.displayName = 'Bar';

const BarInner = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  whiteSpace: 'nowrap',
  height: 40,
});

export const FlexBar = ({ children, ...rest }) => {
  const [left, right] = Children.toArray(children);
  return (
    <Bar {...rest}>
      <BarInner>
        <Side left>{left}</Side>
        {right ? <Side right>{right}</Side> : null}
      </BarInner>
    </Bar>
  );
};
FlexBar.displayName = 'FlexBar';

FlexBar.propTypes = {
  children: PropTypes.node.isRequired,
};
