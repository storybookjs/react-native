import React, { ReactNode } from 'react';
import { View, LayoutChangeEvent, StyleSheet } from 'react-native';

export interface PreviewDimens {
  width: number;
  height: number;
}

type Props = {
  onLayout: (dimens: PreviewDimens) => void;
  previewDimensions: PreviewDimens;
  children: ReactNode;
};

// Android changes screen size when keyboard opens.
// To avoid issues we use absolute positioned element with predefined screen size
const AbsolutePositionedKeyboardAwareView = ({
  onLayout,
  previewDimensions: { width, height },
  children,
}: Props) => {
  const onLayoutHandler = ({ nativeEvent }: LayoutChangeEvent) => {
    onLayout({
      height: nativeEvent.layout.height,
      width: nativeEvent.layout.width,
    });
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
