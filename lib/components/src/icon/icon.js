import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import icons from './icons';

import Svg from './svg';

const Path = styled.path({
  fill: 'currentColor',
});

// TODO: if we can resize the 1024 to 20, we can remove the size attributes
function Icon({ icon, ...props }) {
  return (
    <Svg viewBox="0 0 1024 1024" {...props}>
      <Path d={icons[icon]} />
    </Svg>
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default Icon;
