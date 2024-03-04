import { styled } from '@storybook/theming';
import type { FC } from 'react';
import React from 'react';
import { transparentize } from 'polished';
import { Icon } from './Icon';

interface CollapseIconProps {
  isExpanded: boolean;
}

export const CollapseIconWrapper = styled.div<{ isExpanded: boolean }>(({ theme, isExpanded }) => ({
  width: 8,
  height: 8,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: transparentize(0.4, theme.textMutedColor),
  transform: isExpanded ? 'rotateZ(90deg)' : 'none',
  transition: 'transform .1s ease-out',
}));

export const CollapseIcon: FC<CollapseIconProps> = ({ isExpanded }) => (
  <CollapseIconWrapper isExpanded={isExpanded}>
    <Icon icon="arrowRight" width={8} height={8} />
  </CollapseIconWrapper>
);
