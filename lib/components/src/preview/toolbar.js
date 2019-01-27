import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import { Bar } from '../bar/bar';

export const PositionedBar = styled(Bar)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
});

const IconButton = styled.button(
  {
    height: 40,
    background: 'none',
    color: 'inherit',
    padding: 0,

    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',

    '&:hover, &:focus': {
      outline: '0 none',
      color: '#00aaff',
    },
  },
  ({ active, theme }) =>
    active
      ? {
          outline: '0 none',
          borderBottomColor: theme.colors.highlight,
        }
      : {}
);

const Side = styled.div(
  {
    display: 'flex',
  },
  ({ left }) =>
    left
      ? {
          '& > *': {
            marginRight: 15,
          },
        }
      : {},
  ({ right }) =>
    right
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

const Toolbar = ({ left = null, right = null, shown }) => (
  <PositionedBar hidden={!shown} border>
    <Side flex right>
      {left}
    </Side>
    <Side left>{right}</Side>
  </PositionedBar>
);
Toolbar.propTypes = {
  shown: PropTypes.bool.isRequired,
  left: PropTypes.node.isRequired,
  right: PropTypes.node.isRequired,
};

export { Toolbar, IconButton };
