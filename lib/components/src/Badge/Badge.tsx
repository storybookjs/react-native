import React, { FunctionComponent } from 'react';
import { styled, css } from '@storybook/theming';

type BadgeWrapperProps = BadgeProps;

const BadgeWrapper = styled.div<BadgeWrapperProps>`
  display: inline-block;
  vertical-align: top;
  font-size: 11px;
  line-height: 12px;
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
    props.status === 'positive' &&
    css`
      color: ${props.theme.color.positive};
      background: ${props.theme.background.positive};
    `};

  ${props =>
    props.status === 'negative' &&
    css`
      color: ${props.theme.color.negative};
      background: ${props.theme.background.negative};
    `};

  ${props =>
    props.status === 'neutral' &&
    css`
      color: ${props.theme.color.dark};
      background: ${props.theme.color.mediumlight};
    `};
`;

export interface BadgeProps {
  status: 'positive' | 'negative' | 'neutral';
}

export const Badge: FunctionComponent<BadgeProps> = ({ ...props }) => {
  return <BadgeWrapper {...props} />;
};
