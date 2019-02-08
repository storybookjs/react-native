import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

const Side = styled.div(
  {
    display: 'flex',
  },
  ({ right }) =>
    right
      ? {
          '& > *': {
            marginRight: 15,
          },
        }
      : {},
  ({ left }) =>
    left
      ? {
          '& > *': {
            marginLeft: 15,
          },
        }
      : {},
  ({ flex }) =>
    flex
      ? {
          flex: 1,
        }
      : {}
);
Side.displayName = 'Side';

export const Bar = styled.div(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    background: theme.background.bar,
    color: theme.barTextColor,
    height: 40,
    position: 'relative',
  }),
  ({ scroll = true }) => ({
    overflow: scroll ? 'auto' : 'visible',
    overflowX: scroll ? 'auto' : 'visible',
    overflowY: scroll ? 'hidden' : 'visible',
  }),
  ({ theme, border }) =>
    border
      ? {
          background: `${
            theme.background.bar
          } linear-gradient(to bottom, transparent calc(100% - 1px), ${
            theme.mainBorderColor
          } calc(100% - 1px))`,
        }
      : {}
);
Bar.displayName = 'Bar';

export const FlexBar = ({ children, ...rest }) => {
  const [left, right] = Children.toArray(children);
  return (
    <Bar {...rest}>
      <Side flex left>
        {left}
      </Side>
      {right ? <Side right>{right}</Side> : null}
    </Bar>
  );
};
FlexBar.displayName = 'FlexBar';

FlexBar.propTypes = {
  children: PropTypes.node.isRequired,
};
