import React from 'react';
import PropTypes from 'prop-types';
import { styled, css } from '@storybook/theming';
import { darken, lighten, rgba } from 'polished';

const Text = styled.span`
  display: inline-block;
  vertical-align: top;
`;

const Loading = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  opacity: 0;
`;

// prettier-ignore
const ButtonWrapper = styled.button`
  border: 0;
  border-radius: 3em;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: ${props => props.small ? '8px 16px' : '13px 20px'};
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


  font-size: ${props => props.small ? props.theme.typography.size.s1 : props.theme.typography.size.s2}px;
  font-weight: ${props => props.theme.typography.weight.bold};
  line-height: 1;

  ${props => !props.loading && css`
    ${props.theme.animation.hoverable};

    &:hover {
      box-shadow: rgba(0,0,0,.2) 0 2px 6px 0;
    }

    &:focus {
      box-shadow: ${rgba(props.theme.color.secondary, 0.4)} 0 1px 9px 2px;
    }

    &:focus:hover {
      box-shadow: ${rgba(props.theme.color.secondary, 0.2)} 0 8px 18px 0px;
    }
  `}

  & > span {
    transform: scale3d(1,1,1) translate3d(0,0,0);
    transition: transform 700ms ${props => props.theme.easing.rubber};
    opacity: 1;
  }

  [role="progressbar"] {
    transform: translate3d(0, 100%, 0);
  }

  svg {
    display: inline-block;
    height: ${props => props.small ? '14' : '16'}px;
    width: ${props => props.small ? '14' : '16'}px;
    vertical-align: top;
    margin-right: ${props => props.small ? '4' : '6'}px;
    margin-top: ${props => props.small ? '-1' : '-2'}px;
    margin-bottom: ${props => props.small ? '-1' : '-2'}px;

    /* Necessary for js mouse events to not glitch out when hovering on svgs */
    pointer-events: none;
  }

  ${props => props.disabled && css`
    cursor: not-allowed !important;
		opacity: .5;
    &:hover {
      transform: none;
    }
	`}

  ${props => props.unclickable && css`
    cursor: default !important;
		pointer-events: none;
    &:hover {
      transform: none;
    }
	`}

  ${props => props.loading && css`
    cursor: progress !important;
    opacity: .7;

    [role="progressbar"] {
      transition: transform 700ms ${props.theme.easing.rubber};
      transform: translate3d(0, -50%,0);
      opacity: 1;
    }

    & > span {
      transform: scale3d(0,0,1) translate3d(0,-100%,0);
      opacity: 0;
    }

    &:hover {
      transform: none;
    }
	`}

  ${props => props.containsIcon && css`
    svg {
      display: block;
      margin: 0;
    }
    ${props.small && css`
  		padding: 7px;
  	`}

    ${!props.small && css`
  		padding: 12px;
  	`}
  `}

  ${props => props.primary && css`
    background: ${props.theme.color.primary};
    color: ${props.theme.color.lightest};
    svg path { fill: ${props.theme.color.lightest}; }

    ${!props.loading && css`
      &:hover { background: ${darken(0.05, props.theme.color.primary)};}
      &:active { box-shadow: rgba(0,0,0,.1) 0 0 0 3em inset; }
      &:focus { box-shadow: ${rgba(props.theme.color.primary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${rgba(props.theme.color.primary, 0.2)} 0 8px 18px 0px;}
    `}
	`}

  ${props => props.primary && props.active && css`
    background: transparent;
    box-shadow: ${props.theme.color.primary} 0 0 0 1px inset;
    color: ${props.theme.color.primary};
    svg path { fill: ${props.theme.color.primary}; }

    ${!props.loading && css`
      &:hover {
        background: transparent;
        box-shadow: ${props.theme.color.primary} 0 0 0 1px inset;
      }
      &:active {
        box-shadow: ${props.theme.color.primary} 0 0 0 3em inset;
        color: ${props.theme.color.lightest};
      }
      &:focus { box-shadow: ${props.theme.color.primary} 0 0 0 3em inset, ${rgba(props.theme.color.primary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${props.theme.color.primary} 0 0 0 3em inset, ${rgba(props.theme.color.primary, 0.2)} 0 8px 18px 0px;}
    `}

	`}

  ${props => props.secondary && css`
    background: ${props.theme.color.secondary};
    color: ${props.theme.color.lightest};
    svg path { fill: ${props.theme.color.lightest}; }

    ${!props.loading && css`
      &:hover { background: ${darken(0.05, props.theme.color.secondary)}; }
      &:active { box-shadow: rgba(0,0,0,.1) 0 0 0 3em inset; }
      &:focus { box-shadow: ${rgba(props.theme.color.secondary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${rgba(props.theme.color.secondary, 0.2)} 0 8px 18px 0px;}
    `}
	`}

  ${props => props.secondary && props.active && css`
    background: transparent;
    box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset;
    color: ${props.theme.color.secondary};
    svg path { fill: ${props.theme.color.secondary}; }

    ${!props.loading && css`
      &:hover {
        background: transparent;
        box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset;
      }
      &:active {
        box-shadow: ${props.theme.color.secondary} 0 0 0 3em inset;
        color: ${props.theme.color.lightest};
      }
      &:focus { box-shadow: ${props.theme.color.secondary} 0 0 0 3em inset, ${rgba(props.theme.color.secondary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${props.theme.color.secondary} 0 0 0 3em inset, ${rgba(props.theme.color.secondary, 0.2)} 0 8px 18px 0px;}
    `}
	`}

  ${props => props.tertiary && css`
    background: ${props.theme.color.tertiary};
    color: ${props.theme.color.darkest};
    svg path { fill: ${props.theme.color.darkest}; }

    ${!props.loading && css`
      &:hover { background: ${lighten(0.03, props.theme.color.tertiary)};  }
      &:active { box-shadow: rgba(0,0,0,.1) 0 0 0 3em inset; }
      &:focus { box-shadow: ${rgba(props.theme.color.tertiary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${rgba(props.theme.color.tertiary, 0.2)} 0 8px 18px 0px;}
    `}
	`}

  ${props => props.tertiary && props.active && css`
    background: transparent;
    box-shadow: ${props.theme.color.medium} 0 0 0 1px inset;
    color: ${props.theme.color.darkest};
    svg path { fill: ${props.theme.color.tertiary}; }

    ${!props.loading && css`
      &:hover {
        background: transparent;
        box-shadow: ${props.theme.color.medium} 0 0 0 1px inset;
      }
      &:focus { box-shadow: ${props.theme.color.medium} 0 0 0 1px inset, ${rgba(props.theme.color.tertiary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${props.theme.color.medium} 0 0 0 1px inset, ${rgba(props.theme.color.tertiary, 0.2)} 0 8px 18px 0px;}
    `}

	`}

  ${props => props.outline && css`
    box-shadow: ${props.theme.color.medium} 0 0 0 1px inset;
		color: ${props.theme.color.dark};
    background: transparent;

    svg path { fill: ${props.theme.color.dark}; }

    ${!props.loading && css`
      &:hover { box-shadow: ${props.theme.color.mediumdark} 0 0 0 1px inset; }

      &:active {
        background: ${props.theme.color.medium};
        box-shadow: ${props.theme.color.medium} 0 0 0 1px inset;
        color: ${props.theme.color.darkest};
      }
      &:focus { box-shadow: ${props.theme.color.medium} 0 0 0 1px inset, ${rgba(props.theme.color.secondary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${props.theme.color.medium} 0 0 0 1px inset, ${rgba(props.theme.color.secondary, 0.2)} 0 8px 18px 0px;}
    `};

    ${props.primary && css`
      box-shadow: ${props.theme.color.primary} 0 0 0 1px inset;
  		color: ${props.theme.color.primary};

      svg path { fill: ${props.theme.color.primary}; }

      &:hover {
        box-shadow: ${props.theme.color.primary} 0 0 0 1px inset;
        background: transparent;
      }

      &:active {
        background: ${props.theme.color.primary};
        box-shadow: ${props.theme.color.primary} 0 0 0 1px inset;
        color: ${props.theme.color.lightest};
        svg path { fill: ${props.theme.color.lightest}; }
      }
      &:focus { box-shadow: ${props.theme.color.primary} 0 0 0 1px inset, ${rgba(props.theme.color.primary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${props.theme.color.primary} 0 0 0 1px inset, ${rgba(props.theme.color.primary, 0.2)} 0 8px 18px 0px;}
    `};

    ${props.secondary && css`
      box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset;
  		color: ${props.theme.color.secondary};

      svg path { fill: ${props.theme.color.secondary}; }

      &:hover {
        box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset;
        background: transparent;
      }

      &:active {
        background: ${props.theme.color.secondary};
        box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset;
        color: ${props.theme.color.lightest};
        svg path { fill: ${props.theme.color.lightest}; }
      }
      &:focus { box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset, ${rgba(props.theme.color.secondary, 0.4)} 0 1px 9px 2px; }
      &:focus:hover { box-shadow: ${props.theme.color.secondary} 0 0 0 1px inset, ${rgba(props.theme.color.secondary, 0.2)} 0 8px 18px 0px;}
    `};
	`}

  ${props => props.outline && props.active && css`
    background: ${props.theme.color.medium};
    box-shadow: ${props.theme.color.medium} 0 0 0 1px inset;
    color: ${props.theme.color.darkest};

    svg path { fill: ${props.theme.color.darkest}; }
	`}
`;

const ButtonLink = ButtonWrapper.withComponent('a');

function Button({ loading, loadingText, isLink, children, ...props }) {
  if (isLink) {
    return (
      <ButtonLink loading={loading} {...props}>
        <Text>{children}</Text>
        {loading && (
          <Loading role="progressbar" aria-busy="true">
            {loadingText || 'Loading...'}
          </Loading>
        )}
      </ButtonLink>
    );
  }
  return (
    <ButtonWrapper loading={loading} {...props}>
      <Text>{children}</Text>
      {loading && (
        <Loading role="progressbar" aria-busy="true">
          {loadingText || 'Loading...'}
        </Loading>
      )}
    </ButtonWrapper>
  );
}

Button.propTypes = {
  loading: PropTypes.bool,
  loadingText: PropTypes.node,
  isLink: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  loading: false,
  loadingText: null,
  isLink: false,
};

export default Button;
