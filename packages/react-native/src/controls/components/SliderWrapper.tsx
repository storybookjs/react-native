import { createElement } from 'react';
import CustomSlider from './Slider';
import { getNativeSlider } from '../optionalNativeModules';

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

// Uses @react-native-community/slider when it's installed and linked, and the JS slider otherwise.
const SliderWrapper = ({ useBuiltInSlider = false, ...props }: SliderWrapperProps) => {
  const NativeSlider = useBuiltInSlider ? null : getNativeSlider();

  if (!NativeSlider) {
    return <CustomSlider {...props} />;
  }

  // The slider is resolved once and cached, so it's the same component on every render.
  return createElement(NativeSlider, props);
};

export default SliderWrapper;
