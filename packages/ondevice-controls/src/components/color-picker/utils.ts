import tinycolor, { ColorFormats } from 'tinycolor2';
import { PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

type Point = { x: number; y: number };

interface PanResponderCallbacks {
  onStart?: (
    point: Point,
    evt: GestureResponderEvent,
    state: PanResponderGestureState
  ) => boolean | void;
  onMove?: (
    point: Point,
    evt: GestureResponderEvent,
    state: PanResponderGestureState
  ) => boolean | void;
  onEnd?: (
    point: Point,
    evt: GestureResponderEvent,
    state: PanResponderGestureState
  ) => boolean | void;
}

/**
 * Converts color to hsv representation.
 * @param {string} color any color representation - name, hexa, rgb
 * @return {object} { h: number, s: number, v: number } object literal
 */
export function toHsv(color: string): ColorFormats.HSV {
  return tinycolor(color).toHsv();
}

/**
 * Converts hsv object to hexa color string.
 * @param {object} hsv { h: number, s: number, v: number } object literal
 * @return {string} color in hexa representation
 */
export function fromHsv(hsv: ColorFormats.HSV): string {
  return tinycolor(hsv).toHexString();
}

const fn = () => true;

/**
 * Simplified pan responder wrapper.
 */
export function createPanResponder({
  onStart = fn,
  onMove = fn,
  onEnd = fn,
}: PanResponderCallbacks) {
  return PanResponder.create({
    onStartShouldSetPanResponder: fn,
    onStartShouldSetPanResponderCapture: fn,
    onMoveShouldSetPanResponder: fn,
    onMoveShouldSetPanResponderCapture: fn,
    onPanResponderTerminationRequest: fn,
    onPanResponderGrant: (evt: GestureResponderEvent, state: PanResponderGestureState) => {
      return onStart({ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY }, evt, state);
    },
    onPanResponderMove: (evt: GestureResponderEvent, state: PanResponderGestureState) => {
      return onMove({ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY }, evt, state);
    },
    onPanResponderRelease: (evt: GestureResponderEvent, state: PanResponderGestureState) => {
      return onEnd({ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY }, evt, state);
    },
  });
}
