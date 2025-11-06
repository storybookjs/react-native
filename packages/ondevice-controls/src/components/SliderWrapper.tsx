import React from 'react';
import CustomSlider from './Slider';
import { Platform } from 'react-native';
import type { SliderProps } from '@react-native-community/slider';

let Slider: React.ComponentType<SliderProps> = null;

try {
  Slider = require('@react-native-community/slider').default;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {}

interface SliderWrapperProps {
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  style?: any;
  useBuiltInSlider?: boolean;
}

const supportedPlatforms = ['android', 'ios', 'windows', 'web'];
const nativeSliderSupported = supportedPlatforms.includes(Platform.OS);

const SliderWrapper = ({ useBuiltInSlider = false, ...props }: SliderWrapperProps) => {
  if (!nativeSliderSupported || useBuiltInSlider || Slider === null) {
    return <CustomSlider {...props} />;
  }
  return <Slider {...props} />;
};

export default SliderWrapper;
