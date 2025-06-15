interface BaseMessage {
  type: string;
  args: unknown[];
  from: string;
}

interface BaseNativeEventData {
  timestamp: number;
  // deviceId?: string;
  platform?: 'ios' | 'android';
  sessionId: string;
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

export interface TapCompletedEventData {
  type: 'tapCompleted';
  success: boolean;
  sessionId: string;
}

export interface SwipeCompletedEventData {
  type: 'swipeCompleted';
  success: boolean;
  sessionId: string;
}

export type ServerEventData = TapCompletedEventData | SwipeCompletedEventData;

export interface ServerEventMessage extends BaseMessage {
  type: 'serverEvent';
  args: [ServerEventData];
}

export type WebSocketMessage = BaseMessage | NativeEventMessage | ServerEventMessage;

export const isNativeEventMessage = (message: WebSocketMessage): message is NativeEventMessage => {
  return message.type === 'nativeEvent' && message.args.length > 0;
};

export const isServerEventMessage = (message: WebSocketMessage): message is ServerEventMessage => {
  return message.type === 'serverEvent' && message.args.length > 0;
};

export const isTapEventMessage = (event: NativeEventData): event is TapEventData => {
  return event?.type === 'tap';
};
