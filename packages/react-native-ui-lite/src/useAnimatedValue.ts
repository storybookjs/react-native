import { useState } from 'react';
import { Animated } from 'react-native';

export function useAnimatedValue(
  initialValue: number,
  config?: Animated.AnimatedConfig
): Animated.Value {
  const [value] = useState<null | Animated.Value>(new Animated.Value(initialValue, config));

  return value;
}
