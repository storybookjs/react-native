import React, { AnchorHTMLAttributes, FunctionComponent } from 'react';
import { styled, css, Theme } from '@storybook/theming';
import { darken } from 'polished';

import { Icons } from '../../icon/icon';

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const LEFT_BUTTON = 0;

const isPlainLeftClick = (e: React.MouseEvent) =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

const cancelled = (e: React.MouseEvent, cb: (_e: React.MouseEvent) => void) => {
  if (isPlainLeftClick(e)) {
    e.preventDefault();
    cb(e);
  }
};

export interface LinkStylesProps {
  secondary?: boolean;
  tertiary?: boolean;
  nochrome?: boolean;
  inverse?: boolean;
  isButton?: boolean;
}

const linkStyles = (props: LinkStylesProps & { theme: Theme }) => css`
  display: inline-block;
  transition: all 150ms ease-out;
  text-decoration: none;

  color: ${props.theme.color.secondary};
  svg path {
    fill: ${props.theme.color.secondary};
  }

  &:hover,
  &:focus {
    cursor: pointer;
    color: ${darken(0.07, props.theme.color.secondary)};
    svg path {
      fill: ${darken(0.07, props.theme.color.secondary)};
    }
  }
  &:active {
    color: ${darken(0.1, props.theme.color.secondary)};
    svg path {
      fill: ${darken(0.1, props.theme.color.secondary)};
    }
  }

  svg {
    display: inline-block;
    height: 1em;
    width: 1em;
    vertical-align: text-top;
    position: relative;
    bottom: -0.125em;
    margin-right: 0.4em;
  }

  ${props.secondary &&
    css`
      color: ${props.theme.color.mediumdark};
      svg path {
        fill: ${props.theme.color.mediumdark};
      }

      &:hover {
        color: ${props.theme.color.dark};
        svg path {
          fill: ${props.theme.color.dark};
        }
      }

      &:active {
        color: ${props.theme.color.darker};
        svg path {
          fill: ${props.theme.color.darker};
        }
      }
    `};

  ${props.tertiary &&
    css`
      color: ${props.theme.color.dark};
      svg path {
        fill: ${props.theme.color.dark};
      }

      &:hover {
        color: ${props.theme.color.darkest};
        svg path {
          fill: ${props.theme.color.darkest};
        }
      }

      &:active {
        color: ${props.theme.color.mediumdark};
        svg path {
          fill: ${props.theme.color.mediumdark};
        }
      }
    `};

  ${props.nochrome &&
    css`
      color: inherit;

      &:hover,
      &:active {
        color: inherit;
        text-decoration: underline;
      }
    `};

  ${props.inverse &&
    css`
      color: ${props.theme.color.lightest};
      svg path {
        fill: ${props.theme.color.lightest};
      }

      &:hover {
        color: ${props.theme.color.lighter};
        svg path {
          fill: ${props.theme.color.lighter};
        }
      }

      &:active {
        color: ${props.theme.color.light};
        svg path {
          fill: ${props.theme.color.light};
        }
      }
    `};

  ${props.isButton &&
    css`
      border: 0;
      border-radius: 0;
      background: none;
      padding: 0;
      font-size: inherit;
    `};
`;

export interface LinkInnerProps {
  withArrow?: boolean;
  containsIcon?: boolean;
}

const LinkInner = styled.span`
  ${(props: LinkInnerProps) =>
    props.withArrow &&
    css`
      > svg:last-of-type {
        height: 0.7em;
        width: 0.7em;
        margin-right: 0;
        margin-left: 0.25em;
        bottom: auto;
        vertical-align: inherit;
      }
    `};

  ${props =>
    props.containsIcon &&
    css`
      svg {
        height: 1em;
        width: 1em;
        vertical-align: middle;
        position: relative;
        bottom: 0;
        margin-right: 0;
      }
    `};
`;

type AProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const A = styled.a<AProps>`
  ${linkStyles};
`;

export interface LinkProps extends LinkInnerProps, LinkStylesProps {
  cancel?: boolean;
  className?: string;
  style?: object;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
}

export const Link: FunctionComponent<LinkProps & AProps> = ({
  cancel,
  children,
  onClick,
  withArrow,
  containsIcon,
  className,
  ...rest
}) => {
  return (
    <A {...rest} onClick={cancel ? e => cancelled(e, onClick) : onClick} className={className}>
      <LinkInner withArrow={withArrow} containsIcon={containsIcon}>
        {children}
        {withArrow && <Icons icon="arrowright" />}
      </LinkInner>
    </A>
  );
};

Link.defaultProps = {
  cancel: true,
  className: undefined,
  style: undefined,
  onClick: () => {},
  withArrow: false,
  containsIcon: false,
};
