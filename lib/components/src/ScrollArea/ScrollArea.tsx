// Storybook's implementation of SimpleBar https://github.com/Grsmto/simplebar
// Note: "SimpleBar can't be used on the <body>, <textarea> or <iframe> elements."

import React, { Fragment, FunctionComponent } from 'react';
import { styled, Global } from '@storybook/theming';

import SimpleBar from 'simplebar-react';
import { getScrollAreaStyles } from './ScrollAreaStyles';

export interface ScrollProps {
  horizontal?: boolean;
  vertical?: boolean;
  [key: string]: any;
}

const Scroll = styled(({ vertical, horizontal, ...rest }: ScrollProps) => <SimpleBar {...rest} />)<
  ScrollProps
>(
  ({ vertical }) =>
    !vertical
      ? {
          overflowY: 'hidden',
        }
      : {
          overflowY: 'auto',
          height: '100%',
        },
  ({ horizontal }) =>
    !horizontal
      ? {
          overflowX: 'hidden',
        }
      : {
          overflowX: 'auto',
          width: '100%',
        }
);

export interface ScrollAreaProps {
  horizontal?: boolean;
  vertical?: boolean;
  className?: string;
}

export const ScrollArea: FunctionComponent<ScrollAreaProps> = ({
  children,
  vertical,
  horizontal,
  ...props
}) => (
  <Fragment>
    <Global styles={getScrollAreaStyles} />
    <Scroll vertical={vertical} horizontal={horizontal} {...props}>
      {children}
    </Scroll>
  </Fragment>
);

ScrollArea.defaultProps = {
  horizontal: false,
  vertical: false,
};
