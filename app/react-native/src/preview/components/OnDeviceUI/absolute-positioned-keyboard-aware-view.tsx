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
import style from './style';

export interface PreviewDimens {
  previewWidth: number;
  previewHeight: number;
}

type Props = {
  onLayout: (dimens: PreviewDimens) => void;
} & PreviewDimens;

// Android changes screen size when keyboard opens.
// To avoid issues we use absolute positioned element with predefined screen size
export default class AbsolutePositionedKeyboardAwareView extends PureComponent<Props> {
  keyboardDidShowListener: EmitterSubscription;
  keyboardDidHideListener: EmitterSubscription;
  keyboardOpen: boolean;

  componentWillMount() {
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
      const { previewWidth } = this.props;
      // There is bug in RN android that keyboardDidShow event is called simply when you go from portrait to landscape.
      // To make sure that this is keyboard event we check screen width
      if (previewWidth === e.endCoordinates.width) {
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
        previewHeight: height,
        previewWidth: width,
      });
    }
  };

  render() {
    const { children, previewWidth, previewHeight } = this.props;

    return (
      <View style={style.flex} onLayout={this.onLayoutHandler}>
        <View
          style={
            previewWidth === 0
              ? style.flex
              : { position: 'absolute', width: previewWidth, height: previewHeight }
          }
        >
          {children}
        </View>
      </View>
    );
  }
}
