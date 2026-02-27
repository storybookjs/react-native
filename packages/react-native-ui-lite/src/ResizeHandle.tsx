import { useTheme } from '@storybook/react-native-theming';
import { memo, useMemo, useRef, useState } from 'react';
import { PanResponder, View, ViewStyle } from 'react-native';

interface ResizeHandleProps {
  direction: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

export const ResizeHandle = memo(function ResizeHandle({
  direction,
  onResize,
  onResizeStart,
  onResizeEnd,
}: ResizeHandleProps) {
  const theme = useTheme();
  const [active, setActive] = useState(false);
  const startValueRef = useRef(0);

  const isHorizontal = direction === 'horizontal';

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: () => {
          startValueRef.current = 0;
          setActive(true);
          onResizeStart?.();
        },
        onPanResponderMove: (_, gestureState) => {
          const delta = isHorizontal ? gestureState.dx : gestureState.dy;
          const diff = delta - startValueRef.current;
          startValueRef.current = delta;
          onResize(diff);
        },
        onPanResponderRelease: () => {
          setActive(false);
          onResizeEnd?.();
        },
        onPanResponderTerminate: () => {
          setActive(false);
          onResizeEnd?.();
        },
      }),
    [isHorizontal, onResize, onResizeStart, onResizeEnd]
  );

  const style = useMemo((): ViewStyle => {
    const borderColor = active ? theme.barSelectedColor : theme.appBorderColor;

    if (isHorizontal) {
      return {
        width: 5,
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: borderColor,
        backgroundColor: active ? theme.barSelectedColor : 'transparent',
        // @ts-expect-error - cursor is supported on web and desktop platforms
        cursor: 'col-resize',
      };
    }

    return {
      height: 5,
      alignSelf: 'stretch',
      justifyContent: 'center',
      borderTopWidth: 1,
      borderTopColor: borderColor,
      backgroundColor: active ? theme.barSelectedColor : 'transparent',
      // @ts-expect-error - cursor is supported on web and desktop platforms
      cursor: 'row-resize',
    };
  }, [active, isHorizontal, theme.appBorderColor, theme.barSelectedColor]);

  return <View {...panResponder.panHandlers} style={style} />;
});
