declare module 'react-native-swipe-gestures' {
  export type GestureRecognizerConfig = Partial<{
    velocityThreshold: number;
    directionalOffsetThreshold: number;
    gestureIsClickThreshold: number;
  }>;

  export enum SwipeDirections {
    SWIPE_UP = 'SWIPE_UP',
    SWIPE_DOWN = 'SWIPE_DOWN',
    SWIPE_LEFT = 'SWIPE_LEFT',
    SWIPE_RIGHT = 'SWIPE_RIGHT',
  }

  export interface Props {
    onSwipe?: (swipeDirection: SwipeDirections) => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeTop?: () => void;
    onSwipeBottom?: () => void;
    config: GestureRecognizerConfig;
  }

  declare class GestureRecognizer extends React.Component<Props> {}

  export default GestureRecognizer;
}

// https://github.com/emotion-js/emotion/pull/1176/
declare module '@emotion/native';
