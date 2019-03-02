import React from 'react';
import PropTypes from 'prop-types';
import { styled, css } from '@storybook/theming';
import { darken } from 'polished';

import Icons from '../../icon/icon';

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const LEFT_BUTTON = 0;

const isPlainLeftClick = e =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

const cancelled = (e, cb = () => {}) => {
  if (isPlainLeftClick(e)) {
    e.preventDefault();
    cb(e);
  }
};

const linkStyles = props => css`
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

const LinkInner = styled.span`
  ${props =>
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

const A = styled.a`
  ${linkStyles};
`;

A.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
};

function Link({ cancel, children, onClick, withArrow, containsIcon, className, ...rest }) {
  return (
    <A {...rest} onClick={cancel ? e => cancelled(e, onClick) : onClick} className={className}>
      <LinkInner withArrow={withArrow} containsIcon={containsIcon}>
        {children}
        {withArrow && <Icons icon="arrowright" />}
      </LinkInner>
    </A>
  );
}

Link.propTypes = {
  cancel: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.shape({}),
  children: PropTypes.node,
  onClick: PropTypes.func,
  withArrow: PropTypes.bool,
  containsIcon: PropTypes.bool,
};
Link.defaultProps = {
  cancel: true,
  className: undefined,
  style: undefined,
  children: null,
  onClick: () => {},
  withArrow: false,
  containsIcon: false,
};

export default Link;
