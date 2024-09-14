import { styled } from '@storybook/react-native-theming';
import type { FC } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface CollapseIconProps {
  isExpanded: boolean;
}

export const CollapseIconWrapper = styled.View<{ isExpanded: boolean }>(
  ({ theme, isExpanded }) => ({
    width: 8,
    height: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.textMutedColor,
    transform: isExpanded ? 'rotateZ(90deg)' : 'none',
    transition: 'transform .1s ease-out',
  })
);

export const CollapseIcon: FC<CollapseIconProps> = ({ isExpanded }) => (
  <CollapseIconWrapper isExpanded={isExpanded}>
    {/* <Icon icon="arrowRight" width={8} height={8} /> */}
    <CollapseSVG />
  </CollapseIconWrapper>
);

export function CollapseSVG(props: SvgProps) {
  return (
    <Svg width={8} height={8} fill="none" {...props}>
      <Path
        fill="#73828C"
        d="M1.896 7.146a.5.5 0 10.708.708l3.5-3.5a.5.5 0 000-.708l-3.5-3.5a.5.5 0 10-.708.708L5.043 4 1.896 7.146z"
      />
    </Svg>
  );
}
