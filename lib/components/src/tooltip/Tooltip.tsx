import React, { FunctionComponent } from 'react';
import memoize from 'memoizerific';

import { styled, Color, lighten, darken } from '@storybook/theming';

const match = memoize(1000)((requestes, actual, value, fallback = 0) =>
  actual.split('-')[0] === requestes ? value : fallback
);

const ArrowSpacing = 8;

export interface ArrowProps {
  color: keyof Color;
  placement: string;
}

const Arrow = styled.div<ArrowProps>(
  {
    position: 'absolute',
    borderStyle: 'solid',
  },
  ({ theme, color, placement }) => ({
    marginBottom: `${match('top', placement, '0', ArrowSpacing)}px`,
    marginTop: `${match('bottom', placement, '0', ArrowSpacing)}px`,
    marginRight: `${match('left', placement, '0', ArrowSpacing)}px`,
    marginLeft: `${match('right', placement, '0', ArrowSpacing)}px`,

    bottom: `${match('top', placement, ArrowSpacing * -1, 'auto')}px`,
    top: `${match('bottom', placement, ArrowSpacing * -1, 'auto')}px`,
    right: `${match('left', placement, ArrowSpacing * -1, 'auto')}px`,
    left: `${match('right', placement, ArrowSpacing * -1, 'auto')}px`,

    borderBottomWidth: `${match('top', placement, '0', ArrowSpacing)}px`,
    borderTopWidth: `${match('bottom', placement, '0', ArrowSpacing)}px`,
    borderRightWidth: `${match('left', placement, '0', ArrowSpacing)}px`,
    borderLeftWidth: `${match('right', placement, '0', ArrowSpacing)}px`,

    borderTopColor: match(
      'top',
      placement,
      theme.color[color] || color || theme.base === 'light'
        ? lighten(theme.background.app)
        : darken(theme.background.app),
      'transparent'
    ),
    borderBottomColor: match(
      'bottom',
      placement,
      theme.color[color] || color || theme.base === 'light'
        ? lighten(theme.background.app)
        : darken(theme.background.app),
      'transparent'
    ),
    borderLeftColor: match(
      'left',
      placement,
      theme.color[color] || color || theme.base === 'light'
        ? lighten(theme.background.app)
        : darken(theme.background.app),
      'transparent'
    ),
    borderRightColor: match(
      'right',
      placement,
      theme.color[color] || color || theme.base === 'light'
        ? lighten(theme.background.app)
        : darken(theme.background.app),
      'transparent'
    ),
  })
);

export interface WrapperProps {
  color: keyof Color;
  placement: string;
  hidden?: boolean;
  hasChrome: boolean;
}

const Wrapper = styled.div<WrapperProps>(
  ({ hidden }) => ({
    display: hidden ? 'none' : 'inline-block',
    zIndex: 2147483647,
  }),
  ({ theme, color, hasChrome, placement }) =>
    hasChrome
      ? {
          marginBottom: `${match('top', placement, ArrowSpacing + 2, 0)}px`,
          marginTop: `${match('bottom', placement, ArrowSpacing + 2, 0)}px`,
          marginLeft: `${match('right', placement, ArrowSpacing + 2, 0)}px`,
          marginRight: `${match('left', placement, ArrowSpacing + 2, 0)}px`,

          background:
            theme.color[color] || color || theme.base === 'light'
              ? lighten(theme.background.app)
              : darken(theme.background.app),
          filter: `
            drop-shadow(0px 5px 5px rgba(0,0,0,0.05))
            drop-shadow(0 1px 3px rgba(0,0,0,0.1))
          `,
          borderRadius: theme.appBorderRadius * 2,
          fontSize: theme.typography.size.s1,
        }
      : {
          marginBottom: `${match('top', placement, 8, 0)}px`,
          marginTop: `${match('bottom', placement, 8, 0)}px`,
          marginLeft: `${match('right', placement, 8, 0)}px`,
          marginRight: `${match('left', placement, 8, 0)}px`,
        }
);

export interface TooltipProps {
  arrowRef?: any;
  tooltipRef?: any;
  hasChrome?: boolean;
  arrowProps?: any;
  placement?: string;
  color?: keyof Color;
}

export const Tooltip: FunctionComponent<TooltipProps> = ({
  placement,
  hasChrome,
  children,
  arrowProps,
  tooltipRef,
  arrowRef,
  color,
  ...props
}) => {
  return (
    <Wrapper hasChrome={hasChrome} placement={placement} ref={tooltipRef} {...props} color={color}>
      {hasChrome && <Arrow placement={placement} ref={arrowRef} {...arrowProps} color={color} />}
      {children}
    </Wrapper>
  );
};

Tooltip.defaultProps = {
  color: undefined,
  arrowRef: undefined,
  tooltipRef: undefined,
  hasChrome: true,
  placement: 'top',
  arrowProps: {},
};
