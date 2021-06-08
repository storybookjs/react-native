import React, { ReactNode, useRef, useEffect } from 'react';
import {
  Platform,
  Keyboard,
  Dimensions,
  View,
  LayoutChangeEvent,
  KeyboardEvent,
  StyleSheet,
} from 'react-native';

export interface PreviewDimens {
  width: number;
  height: number;
}

type Props = {
  onLayout: (dimens: PreviewDimens) => void;
  previewDimensions: PreviewDimens;
  children: ReactNode;
};

const useIsKeyboardOpen = (previewWidth: number) => {
  const keyboardOpen = useRef(false);
  useEffect(() => {
    const keyboardDidShowHandler = (e: KeyboardEvent) => {
      if (Platform.OS === 'android') {
        // There is bug in RN android that keyboardDidShow event is called when you go from portrait to landscape.
        // To make sure that this is keyboard event we check screen width
        if (previewWidth === e.endCoordinates.width) {
          keyboardOpen.current = true;
        }
      }
    };

    const keyboardDidHideHandler = () => {
      if (keyboardOpen.current) {
        keyboardOpen.current = false;
      }
    };

    // When rotating screen from portrait to landscape with keyboard open on android it calls keyboardDidShow, but doesn't call
    // keyboardDidHide. To avoid issues we set keyboardOpen to false immediately on keyboardChange.
    const removeKeyboardOnOrientationChange = () => {
      if (Platform.OS === 'android') {
        keyboardOpen.current = false;
      }
    };

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShowHandler);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHideHandler);
    Dimensions.addEventListener('change', removeKeyboardOnOrientationChange);
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      Dimensions.removeEventListener('change', removeKeyboardOnOrientationChange);
    };
  }, [previewWidth]);

  return keyboardOpen.current;
};

// Android changes screen size when keyboard opens.
// To avoid issues we use absolute positioned element with predefined screen size
const AbsolutePositionedKeyboardAwareView = ({
  onLayout,
  previewDimensions: { width, height },
  children,
}: Props) => {
  const keyboardOpen = useIsKeyboardOpen(width);

  const onLayoutHandler = ({ nativeEvent }: LayoutChangeEvent) => {
    if (!keyboardOpen) {
      onLayout({
        height: nativeEvent.layout.height,
        width: nativeEvent.layout.width,
      });
    }
  };

  return (
    <View style={styles.container} onLayout={onLayoutHandler}>
      <View
        style={
          width === 0
            ? styles.container
            : [styles.absolute, { position: 'absolute', width, height }]
        }
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  absolute: { position: 'absolute' },
  container: { flex: 1 },
});

export default React.memo(AbsolutePositionedKeyboardAwareView);
