import { useTheme } from '@storybook/react-native-theming';
import { forwardRef, memo, ReactNode, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  PanResponderInstance,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSelectedNode } from './SelectedNodeProvider';
import useAnimatedValue from './useAnimatedValue';

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
}

export interface MobileMenuDrawerRef {
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const MobileMenuDrawer = memo(
  forwardRef<MobileMenuDrawerRef, MobileMenuDrawerProps>(({ children }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollToSelectedNode, scrollRef } = useSelectedNode();
    const theme = useTheme();

    // Create a reference for the drag handle animation
    const dragY = useAnimatedValue(0);

    // Create the pan responder for handling drag gestures
    const panResponder = useRef<PanResponderInstance>(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only capture downward dragging motions
          return gestureState.dy > 0;
        },
        onPanResponderMove: (_, gestureState) => {
          // Update dragY based on the gesture
          if (gestureState.dy > 0) {
            dragY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          // If dragged down enough, close the drawer
          if (gestureState.dy > 50) {
            Keyboard.dismiss();
            setMobileMenuOpen(false);
          }
          // Reset the drag position
          Animated.timing(dragY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        },
      })
    ).current;

    useImperativeHandle(ref, () => ({
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          dragY.setValue(0);
          scrollToSelectedNode();
          setMobileMenuOpen(true);
        } else {
          Keyboard.dismiss();
          setMobileMenuOpen(false);
        }
      },
    }));

    // Create the styles for the drag handle
    const handleStyle = useMemo(
      () => ({
        width: 40,
        height: 5,
        backgroundColor: theme.color.mediumdark,
        borderRadius: 2.5,
        alignSelf: 'center' as const, // TypeScript needs this to recognize 'center' as a valid FlexAlignType
        marginVertical: 8,
      }),
      [theme.color.mediumdark]
    );

    return (
      <Modal
        visible={mobileMenuOpen}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Pressable style={{ flex: 1 }} onPress={() => setMobileMenuOpen(false)}></Pressable>
          </View>

          <Animated.View
            style={[
              {
                height: '65%',
                borderTopColor: theme.appBorderColor,
                borderTopWidth: 1,
                borderStyle: 'solid',
                backgroundColor: theme.background.content,
                elevation: 8,
              },
              { transform: [{ translateY: dragY }] },
            ]}
          >
            {/* Drag handle */}
            <View
              {...panResponder.panHandlers}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.background.content,
              }}
            >
              <View style={handleStyle} />
            </View>

            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              style={{
                flex: 1,
                paddingBottom: 150,
                alignSelf: 'flex-end',
                width: '100%',
                backgroundColor: theme.background.content,
              }}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    );
  })
);
