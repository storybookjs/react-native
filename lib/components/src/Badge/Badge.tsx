import React, { FunctionComponent } from 'react';
import { styled, css } from '@storybook/theming';

type BadgeWrapperProps = BadgeProps;

const BadgeWrapper = styled.div<BadgeWrapperProps>`
  display: inline-block;
  font-size: 11px;
  line-height: 12px;
  align-self: center;
  padding: 4px 12px;
  border-radius: 3em;
  font-weight: ${props => props.theme.typography.weight.bold};

  svg {
    height: 12px;
    width: 12px;
    margin-right: 4px;
    margin-top: -2px;

    path {
      fill: currentColor;
    }
  }

  ${props =>
    props.status === 'critical' &&
    css`
      color: ${props.theme.color.critical};
      background: ${props.theme.background.critical};
    `};

  ${props =>
    props.status === 'negative' &&
    css`
      color: ${props.theme.color.negative};
      background: ${props.theme.background.negative};
    `};

  ${props =>
    props.status === 'warning' &&
    css`
      color: ${props.theme.color.warning};
      background: ${props.theme.background.warning};
    `};

  ${props =>
    props.status === 'neutral' &&
    css`
      color: ${props.theme.color.dark};
      background: ${props.theme.color.mediumlight};
    `};

  ${props =>
    props.status === 'positive' &&
    css`
      color: ${props.theme.color.positive};
      background: ${props.theme.background.positive};
    `};
`;

export interface BadgeProps {
  status: 'positive' | 'negative' | 'neutral' | 'warning' | 'critical';
}

export const Badge: FunctionComponent<BadgeProps> = ({ ...props }) => {
  return <BadgeWrapper {...props} />;
};
