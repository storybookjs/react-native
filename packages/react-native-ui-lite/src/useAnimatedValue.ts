import { useRef } from 'react';
import { Animated } from 'react-native';

export default function useAnimatedValue(
  initialValue: number,
  config?: Animated.AnimatedConfig
): Animated.Value {
  const ref = useRef<null | Animated.Value>(null);
  if (ref.current == null) {
    ref.current = new Animated.Value(initialValue, config);
  }
  return ref.current;
}
