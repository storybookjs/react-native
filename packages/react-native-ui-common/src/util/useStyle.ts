import { DependencyList, useMemo } from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * A hook to memoize a style. Uses `ViewStyle` per default, but can be used with other styles deriving from `FlexStyle` as well, such as `TextStyle`.
 * @param styleFactory The function that returns a style
 * @param deps The dependencies to trigger memoization re-evaluation
 * @see ["Memoize!!! 💾 - a react (native) performance guide"](https://gist.github.com/mrousavy/0de7486814c655de8a110df5cef74ddc)
 * @example
 *
 * // simple object styles
 * const style1 = useStyle(() => ({ height: someDynamicValue }), [someDynamicValue])
 *
 * // array styles
 * const style2 = useStyle(
 *   () => [styles.container, props.style, { height: someDynamicValue }],
 *   [props.style, someDynamicValue]
 * );
 */
export const useStyle = <
  TStyle extends ViewStyle | TextStyle | ImageStyle,
  TOutput extends StyleProp<TStyle>,
>(
  styleFactory: () => TOutput,
  deps?: DependencyList
): TOutput =>
  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(styleFactory, deps);
