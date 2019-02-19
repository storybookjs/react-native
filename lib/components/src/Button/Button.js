import React from 'react';
import PropTypes from 'prop-types';
import { styled, css } from '@storybook/theming';
import { darken, lighten, rgba, transparentize } from 'polished';

const ButtonWrapper = styled.button`
  border: 0;
  border-radius: 3em;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: ${props => (props.small ? '10px 16px' : '13px 20px')};
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: all 150ms ease-out;
  transform: translate3d(0,0,0);
  vertical-align: top;
  white-space: nowrap;
  user-select: none;
  opacity: 1;
  margin: 0;
  background: transparent;


  font-size: ${props =>
    props.small ? props.theme.typography.size.s1 : props.theme.typography.size.s2 - 1}px;
  font-weight: ${props => props.theme.typography.weight.bold};
  line-height: 1;


  svg {
    display: inline-block;
    height: ${props => (props.small ? '14' : '16')}px;
    width: ${props => (props.small ? '14' : '16')}px;
    vertical-align: top;
    margin-right: ${props => (props.small ? '4' : '6')}px;
    margin-top: ${props => (props.small ? '-1' : '-2')}px;
    margin-bottom: ${props => (props.small ? '-1' : '-2')}px;

    /* Necessary for js mouse events to not glitch out when hovering on svgs */
    pointer-events: none;

    path { fill: currentColor; }
  }

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed !important;
      opacity: 0.5;
      &:hover {
        transform: none;
      }
    `}

  ${props =>
    props.containsIcon &&
    css`
      svg {
        display: block;
        margin: 0;
      }

      ${props.small &&
        css`
          padding: 9px;
        `}

      ${!props.small &&
        css`
          padding: 12px;
        `}
    `}

  /* Colored button for primary CTAs */
  ${props =>
    props.primary &&
    css`
      background: ${props.theme.color.primary};
      color: ${props.theme.color.lightest};

      &:hover {
        background: ${darken(0.05, props.theme.color.primary)};
      }
      &:active {
        box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 3em inset;
      }
      &:focus {
        box-shadow: ${rgba(props.theme.color.primary, 0.4)} 0 1px 9px 2px;
      }
      &:focus:hover {
        box-shadow: ${rgba(props.theme.color.primary, 0.2)} 0 8px 18px 0px;
      }
    `}


  /* Colored button for secondary CTAs */
  ${props =>
    props.secondary &&
    css`
      background: ${props.theme.color.secondary};
      color: ${props.theme.color.lightest};

      &:hover {
        background: ${darken(0.05, props.theme.color.secondary)};
      }
      &:active {
        box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 3em inset;
      }
      &:focus {
        box-shadow: ${rgba(props.theme.color.secondary, 0.4)} 0 1px 9px 2px;
      }
      &:focus:hover {
        box-shadow: ${rgba(props.theme.color.secondary, 0.2)} 0 8px 18px 0px;
      }
    `}

  /* Button for tertiary CTAs and forms that responds to theme */
  ${props =>
    props.tertiary &&
    css`
      background: ${props.theme.base === 'light'
        ? darken(0.02, props.theme.input.background)
        : lighten(0.02, props.theme.input.background)};
      color: ${props.theme.input.color};
      box-shadow: ${props.theme.input.border} 0 0 0 1px inset;
      border-radius: ${props.theme.input.borderRadius}px;

      &:hover {
        background: ${props.theme.base === 'light'
          ? darken(0.05, props.theme.input.background)
          : lighten(0.05, props.theme.input.background)};
        ${props.inForm
          ? ''
          : 'box-shadow: rgba(0,0,0,.2) 0 2px 6px 0, rgba(0,0,0,.1) 0 0 0 1px inset'}
      }
      &:active {
        background: ${props.theme.base === 'light'
          ? props.theme.input.background
          : props.theme.input.background};
      }
      &:focus {
        box-shadow: ${rgba(props.theme.color.secondary, 0.4)} 0 0 0 1px inset;
      }
    `}

  /* Button that's outlined */
  ${props =>
    props.outline &&
    css`
      box-shadow: ${transparentize(0.8, props.theme.color.defaultText)} 0 0 0 1px inset;
      color: ${transparentize(0.3, props.theme.color.defaultText)};
      background: transparent;

      &:hover {
        box-shadow: ${transparentize(0.5, props.theme.color.defaultText)} 0 0 0 1px inset;
      }

      &:active {
        box-shadow: ${transparentize(0.5, props.theme.color.defaultText)} 0 0 0 2px inset;
        color: ${transparentize(0, props.theme.color.defaultText)};
      }

      ${props.primary &&
        css`
          box-shadow: ${props.theme.color.primary} 0 0 0 1px inset;
          color: ${props.theme.color.primary};

          svg path {
            fill: ${props.theme.color.primary};
          }

          &:hover {
            box-shadow: ${props.theme.color.primary} 0 0 0 1px inset;
            background: transparent;
          }

          &:active {
            background: ${props.theme.color.primary};
            box-shadow: ${props.theme.color.primary} 0 0 0 1px inset;
            color: ${props.theme.color.lightest};
          }
          &:focus {
            box-shadow: ${props.theme.color.primary} 0 0 0 1px inset,
              ${rgba(props.theme.color.primary, 0.4)} 0 1px 9px 2px;
          }
          &:focus:hover {
            box-shadow: ${props.theme.color.primary} 0 0 0 1px inset,
              ${rgba(props.theme.color.primary, 0.2)} 0 8px 18px 0px;
          }
        `};

      ${props.secondary &&
        css`
          box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset;
          color: ${props.theme.color.secondary};

          &:hover {
            box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset;
            background: transparent;
          }

          &:active {
            background: ${props.theme.color.secondary};
            box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset;
            color: ${props.theme.color.lightest};
          }
          &:focus {
            box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset,
              ${rgba(props.theme.color.secondary, 0.4)} 0 1px 9px 2px;
          }
          &:focus:hover {
            box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset,
              ${rgba(props.theme.color.secondary, 0.2)} 0 8px 18px 0px;
          }
        `};
    `}
`;

const ButtonLink = ButtonWrapper.withComponent('a');

function Button({ isLink, children, ...props }) {
  if (isLink) {
    return <ButtonLink {...props}>{children}</ButtonLink>;
  }
  return <ButtonWrapper {...props}>{children}</ButtonWrapper>;
}

Button.propTypes = {
  isLink: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  isLink: false,
};

export default Button;
