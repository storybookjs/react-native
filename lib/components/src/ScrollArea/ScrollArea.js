// Storybook's implementation of SimpleBar https://github.com/Grsmto/simplebar
// Note: "SimpleBar can't be used on the <body>, <textarea> or <iframe> elements."

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled, Global } from '@storybook/theming';

import SimpleBar from 'simplebar-react';
import { getScrollAreaStyles } from './ScrollAreaStyles';

const Scroll = styled(({ vertical, horizontal, ...rest }) => <SimpleBar {...rest} />)(
  ({ vertical }) =>
    !vertical
      ? {
          overflowY: 'hidden',
        }
      : {
          overflowY: 'auto',
        },
  ({ horizontal }) =>
    !horizontal
      ? {
          overflowX: 'hidden',
        }
      : {
          overflowX: 'auto',
        }
);

export const ScrollArea = ({ children, vertical, horizontal, ...props }) => (
  <Fragment>
    <Global styles={getScrollAreaStyles} />
    <Scroll vertical={vertical} horizontal={horizontal} {...props}>
      {children}
    </Scroll>
  </Fragment>
);

ScrollArea.propTypes = {
  children: PropTypes.node.isRequired,
  horizontal: PropTypes.bool,
  vertical: PropTypes.bool,
};
ScrollArea.defaultProps = {
  horizontal: false,
  vertical: false,
};
