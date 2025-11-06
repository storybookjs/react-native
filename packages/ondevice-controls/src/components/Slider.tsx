import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  I18nManager,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';
import { styled } from '@storybook/react-native-theming';

interface SliderProps {
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  style?: any;
}

const THUMB_SIZE = 32;
const THUMB_RADIUS = THUMB_SIZE / 2;
const THUMB_HIT_SLOP = THUMB_SIZE;

const SliderContainer = styled.View({
  height: 48,
  justifyContent: 'center',
  paddingHorizontal: 10,
});

const Track = styled.View(({ theme }) => ({
  height: 4,
  borderRadius: 2,
  backgroundColor: theme.appBorderColor,
  position: 'relative',
  width: '100%',
}));

const Fill = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: 4,
  borderRadius: 2,
  backgroundColor: theme.color.positive,
}));

const Thumb = styled.View(({ theme }) => ({
  width: THUMB_SIZE,
  height: THUMB_SIZE,
  borderRadius: THUMB_RADIUS,
  backgroundColor: theme.color.positive,
  borderWidth: 2,
  borderColor: theme.background.content,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}));

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const Slider = ({
  minimumValue = 0,
  maximumValue = 1,
  step,
  value = minimumValue,
  onValueChange,
  onSlidingComplete,
  disabled = false,
  style,
}: SliderProps) => {
  const isRTL = I18nManager.isRTL;
  const initialValueRef = useRef(value ?? minimumValue);
  const [trackWidth, setTrackWidth] = useState(0);
  const [displayValue, setDisplayValue] = useState(initialValueRef.current);

  const translateX = useRef(new Animated.Value(0)).current;
  const currentTranslateRef = useRef(0);
  const startTranslateRef = useRef(0);
  const isDraggingRef = useRef(false);

  const range = maximumValue - minimumValue || 1;

  const clampValue = useCallback(
    (raw: number) => {
      let clampedValue = clamp(raw, minimumValue, maximumValue);
      if (step && step > 0) {
        const steps = Math.round((clampedValue - minimumValue) / step);
        clampedValue = minimumValue + steps * step;
        clampedValue = clamp(clampedValue, minimumValue, maximumValue);
      }
      return clampedValue;
    },
    [minimumValue, maximumValue, step]
  );

  const valueToTranslate = useCallback(
    (val: number, width: number) => {
      if (width <= 0) return 0;
      const clampedValue = clampValue(val);
      const ratio = (clampedValue - minimumValue) / range;
      const normalized = isRTL ? 1 - ratio : ratio;
      return normalized * width;
    },
    [clampValue, minimumValue, range, isRTL]
  );

  const translateToValue = useCallback(
    (translate: number, width: number) => {
      if (width <= 0) return clampValue(minimumValue);
      const ratio = clamp(translate / width, 0, 1);
      const normalized = isRTL ? 1 - ratio : ratio;
      const raw = minimumValue + normalized * range;
      return clampValue(raw);
    },
    [clampValue, minimumValue, range, isRTL]
  );

  const clampTranslate = useCallback(
    (translate: number, width: number) => clamp(translate, 0, width),
    []
  );

  const updateFromTranslate = useCallback(
    (nextTranslate: number, width: number, notify: boolean) => {
      const clampedTranslate = clampTranslate(nextTranslate, width);
      const snappedValue = translateToValue(clampedTranslate, width);
      const snappedTranslate = valueToTranslate(snappedValue, width);
      translateX.setValue(snappedTranslate);
      currentTranslateRef.current = snappedTranslate;
      setDisplayValue(snappedValue);
      if (notify) {
        onValueChange?.(snappedValue);
      }
    },
    [clampTranslate, translateToValue, valueToTranslate, translateX, onValueChange]
  );

  // Sync with external value when not dragging
  useEffect(() => {
    if (isDraggingRef.current) return;
    const clamped = clampValue(value ?? minimumValue);
    setDisplayValue(clamped);
    if (trackWidth > 0) {
      const translate = valueToTranslate(clamped, trackWidth);
      translateX.setValue(translate);
      currentTranslateRef.current = translate;
    }
  }, [value, trackWidth, clampValue, valueToTranslate, translateX, minimumValue]);

  const handlePanMove = useCallback(
    (gestureState: PanResponderGestureState, width: number) => {
      const delta = isRTL ? -gestureState.dx : gestureState.dx;
      const nextTranslate = startTranslateRef.current + delta;
      updateFromTranslate(nextTranslate, width, true);
    },
    [updateFromTranslate, isRTL]
  );

  const handlePanEnd = useCallback(
    (width: number, shouldNotifyComplete: boolean) => {
      isDraggingRef.current = false;
      const snappedValue = translateToValue(currentTranslateRef.current, width);
      const snappedTranslate = valueToTranslate(snappedValue, width);
      translateX.setValue(snappedTranslate);
      currentTranslateRef.current = snappedTranslate;
      setDisplayValue(snappedValue);
      if (shouldNotifyComplete) {
        onValueChange?.(snappedValue);
        onSlidingComplete?.(snappedValue);
      }
    },
    [translateToValue, valueToTranslate, translateX, onValueChange, onSlidingComplete]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onStartShouldSetPanResponderCapture: () => !disabled,
        onMoveShouldSetPanResponderCapture: () => !disabled,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          if (disabled || trackWidth <= 0) return;
          isDraggingRef.current = true;
          const rawTouchX = evt.nativeEvent.locationX - THUMB_RADIUS;
          const clampedTouch = clamp(rawTouchX, 0, trackWidth);
          const proposedTranslate = isRTL ? trackWidth - clampedTouch : clampedTouch;
          const currentTranslate = currentTranslateRef.current;
          const distanceFromThumb = Math.abs(proposedTranslate - currentTranslate);

          if (distanceFromThumb <= THUMB_HIT_SLOP) {
            // Treat as grabbing the existing thumb position — don't jump.
            startTranslateRef.current = currentTranslate;
            const currentValue = translateToValue(currentTranslate, trackWidth);
            setDisplayValue(currentValue);
            onValueChange?.(currentValue);
          } else {
            // Treat as tap on track: jump to that location before dragging.
            updateFromTranslate(proposedTranslate, trackWidth, true);
            startTranslateRef.current = currentTranslateRef.current;
          }
        },
        onPanResponderMove: (
          _evt: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => {
          if (disabled || trackWidth <= 0) return;
          handlePanMove(gestureState, trackWidth);
        },
        onPanResponderRelease: () => {
          if (trackWidth <= 0) return;
          handlePanEnd(trackWidth, true);
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderTerminate: () => {
          if (trackWidth <= 0) return;
          handlePanEnd(trackWidth, true);
        },
      }),
    [
      disabled,
      trackWidth,
      handlePanMove,
      handlePanEnd,
      updateFromTranslate,
      translateToValue,
      onValueChange,
      isRTL,
    ]
  );

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    const usableWidth = Math.max(width - THUMB_RADIUS * 2, 0);
    setTrackWidth(usableWidth);
    if (usableWidth > 0) {
      const translate = valueToTranslate(displayValue, usableWidth);
      translateX.setValue(translate);
      currentTranslateRef.current = translate;
    }
  };

  const fillWidth = trackWidth > 0 ? ((displayValue - minimumValue) / range) * trackWidth : 0;
  const fillStyle = isRTL
    ? [styles.fillBase, { right: 0, width: fillWidth }]
    : [styles.fillBase, { left: 0, width: fillWidth }];

  return (
    <SliderContainer style={style}>
      <View
        style={styles.touchArea}
        onLayout={handleTrackLayout}
        {...panResponder.panHandlers}
        collapsable={false}
      >
        <Track>
          <Fill style={fillStyle} />
          <Animated.View
            style={[styles.thumbWrapper, { transform: [{ translateX }] }]}
            pointerEvents="none"
          >
            <Thumb />
          </Animated.View>
        </Track>
      </View>
    </SliderContainer>
  );
};

const styles = StyleSheet.create({
  touchArea: {
    height: 48,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: THUMB_RADIUS,
  },
  thumbWrapper: {
    position: 'absolute',
    top: -THUMB_RADIUS,
    left: -THUMB_RADIUS,
  },
  fillBase: {
    position: 'absolute',
    top: 0,
    height: 4,
    borderRadius: 2,
  },
});

export default Slider;
