import React, { PureComponent } from 'react';
import {
  Platform,
  Keyboard,
  Dimensions,
  View,
  EmitterSubscription,
  LayoutChangeEvent,
  KeyboardEvent,
} from 'react-native';

export interface PreviewDimens {
  width: number;
  height: number;
}

type Props = {
  onLayout: (dimens: PreviewDimens) => void;
  previewDimensions: PreviewDimens;
};

// Android changes screen size when keyboard opens.
// To avoid issues we use absolute positioned element with predefined screen size
export default class AbsolutePositionedKeyboardAwareView extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShowHandler
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHideHandler
    );
    Dimensions.addEventListener('change', this.removeKeyboardOnOrientationChange);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    Dimensions.removeEventListener('change', this.removeKeyboardOnOrientationChange);
  }

  keyboardDidShowHandler = (e: KeyboardEvent) => {
    if (Platform.OS === 'android') {
      const {
        previewDimensions: { width },
      } = this.props;
      // There is bug in RN android that keyboardDidShow event is called when you go from portrait to landscape.
      // To make sure that this is keyboard event we check screen width
      if (width === e.endCoordinates.width) {
        this.keyboardOpen = true;
      }
    }
  };

  // When rotating screen from portrait to landscape with keyboard open on android it calls keyboardDidShow, but doesn't call
  // keyboardDidHide. To avoid issues we set keyboardOpen to false immediately on keyboardChange.
  removeKeyboardOnOrientationChange = () => {
    if (Platform.OS === 'android') {
      this.keyboardOpen = false;
    }
  };

  keyboardDidHideHandler = () => {
    if (this.keyboardOpen) {
      this.keyboardOpen = false;
    }
  };

  onLayoutHandler = ({ nativeEvent }: LayoutChangeEvent) => {
    if (!this.keyboardOpen) {
      const { width, height } = nativeEvent.layout;
      const { onLayout } = this.props;

      onLayout({
        height,
        width,
      });
    }
  };

  keyboardDidShowListener: EmitterSubscription;

  keyboardDidHideListener: EmitterSubscription;

  keyboardOpen: boolean;

  render() {
    const {
      children,
      previewDimensions: { width, height },
    } = this.props;

    return (
      <View style={{ flex: 1 }} onLayout={this.onLayoutHandler}>
        <View style={width === 0 ? { flex: 1 } : { position: 'absolute', width, height }}>
          {children}
        </View>
      </View>
    );
  }
}
