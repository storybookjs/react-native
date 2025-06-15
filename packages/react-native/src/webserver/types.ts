interface BaseMessage {
  type: string;
  args: unknown[];
  from: string;
}

interface BaseNativeEventData {
  timestamp: number;
  // deviceId?: string;
  platform?: 'ios' | 'android';
}

interface TapEventData extends BaseNativeEventData {
  type: 'tap';
  x: number;
  y: number;
  duration?: number;
}

interface SwipeEventData extends BaseNativeEventData {
  type: 'swipe';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
}

interface LongPressEventData extends BaseNativeEventData {
  type: 'longPress';
  x: number;
  y: number;
  duration: number;
}

interface DoubleTapEventData extends BaseNativeEventData {
  type: 'doubleTap';
  x: number;
  y: number;
}

interface ScreenshotEventData extends BaseNativeEventData {
  type: 'screenshot';
  base64?: string;
  path?: string;
}

interface OrientationChangeEventData extends BaseNativeEventData {
  type: 'orientationChange';
  orientation: 'portrait' | 'landscape';
}

export type NativeEventData =
  | TapEventData
  | SwipeEventData
  | LongPressEventData
  | DoubleTapEventData
  | ScreenshotEventData
  | OrientationChangeEventData;

export interface NativeEventMessage extends BaseMessage {
  type: 'nativeEvent';
  args: [NativeEventData];
}

export type WebSocketMessage = BaseMessage | NativeEventMessage;

export const isNativeEventMessage = (message: WebSocketMessage): message is NativeEventMessage => {
  return message.type === 'nativeEvent' && message.args.length > 0;
};

export const isTapEventMessage = (event: NativeEventData): event is TapEventData => {
  return event?.type === 'tap';
};
