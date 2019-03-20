import React, { FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import icons, { IconKey } from './icons';

import Svg from './svg';

const Path = styled.path({
  fill: 'currentColor',
});

export interface IconProps {
  icon: IconKey;
}

// TODO: if we can resize the 1024 to 20, we can remove the size attributes
const Icon: FunctionComponent<IconProps> = ({ icon, ...props }) => {
  return (
    <Svg viewBox="0 0 1024 1024" {...props}>
      <Path d={icons[icon]} />
    </Svg>
  );
};

export default Icon;
