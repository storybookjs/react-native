import { useState } from 'react';
import { Animated } from 'react-native';

// this is needed because on react-native-web useAnimatedValue is not available
export function useAnimatedValue(
  initialValue: number,
  config?: Animated.AnimatedConfig
): Animated.Value {
  const [value] = useState<null | Animated.Value>(new Animated.Value(initialValue, config));

  return value;
}
