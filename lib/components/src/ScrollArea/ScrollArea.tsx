// Storybook's implementation of SimpleBar https://github.com/Grsmto/simplebar
// Note: "SimpleBar can't be used on the <body>, <textarea> or <iframe> elements."

import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import { styled, Global } from '@storybook/theming';

import SimpleBar from 'simplebar-react';
import { getScrollAreaStyles } from './ScrollAreaStyles';

export interface ScrollProps {
  horizontal?: boolean;
  vertical?: boolean;
  [key: string]: any;
}

const Scroll = styled(({ vertical, horizontal, ...rest }: ScrollProps) => <SimpleBar {...rest} />)(
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

export interface ScrollAreaProps {
  horizontal?: boolean;
  vertical?: boolean;
  className?: string;
}

// Need to define ScrollArea using old fashioned `function ScrollArea` to avoid TS compiler to
// generate an anonymous function instead of naming it ScrollArea...
// See https://github.com/storybooks/storybook/pull/6095#issuecomment-477480930
// tslint:disable-next-line:no-shadowed-variable
export const ScrollArea: FunctionComponent<ScrollAreaProps> = function ScrollArea({
  children,
  vertical,
  horizontal,
  ...props
}) {
  return (
    <Fragment>
      <Global styles={getScrollAreaStyles} />
      <Scroll vertical={vertical} horizontal={horizontal} {...props}>
        {children}
      </Scroll>
    </Fragment>
  );
};

ScrollArea.defaultProps = {
  horizontal: false,
  vertical: false,
};
