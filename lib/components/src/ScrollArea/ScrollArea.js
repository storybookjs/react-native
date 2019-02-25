// Storybook's implementation of SimpleBar https://github.com/Grsmto/simplebar
// Note: "SimpleBar can't be used on the <body>, <textarea> or <iframe> elements."

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Global } from '@storybook/theming';

import SimpleBar from 'simplebar-react';
import { getScrollAreaStyles } from './ScrollAreaStyles';

export const ScrollArea = ({ children, className, ...props }) => (
  <Fragment>
    <Global styles={getScrollAreaStyles} />
    <SimpleBar className={className} {...props}>
      {children}
    </SimpleBar>
  </Fragment>
);

ScrollArea.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
ScrollArea.defaultProps = {
  className: null,
};
