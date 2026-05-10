import { Portal } from '@gorhom/portal';
import { Button } from '@storybook/react-native-ui-common';
import { useTheme } from '@storybook/react-native-theming';
import {
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  useWindowDimensions,
  PanResponder,
  Pressable,
  View,
  ViewStyle,
  KeyboardEventListener,
  Platform,
} from 'react-native';

import { useSelectedNode } from './SelectedNodeProvider';
import useAnimatedValue from './useAnimatedValue';

const flexStyle: ViewStyle = { flex: 1 };

const portalContainerStyle: ViewStyle = {
  flex: 1,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
};

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
  onVisibilityChange?: (visible: boolean) => void;
  showScrollToSelected?: boolean;
}

export interface MobileMenuDrawerRef {
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const useAnimatedModalHeight = () => {
  const { height } = useWindowDimensions();
  const modalHeight = 0.65 * height;
  const maxModalHeight = 0.85 * height;
  const [sheetHeight, setSheetHeight] = useState(modalHeight);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    setSheetHeight(modalHeight);
    setKeyboardInset(0);
    setIsKeyboardVisible(false);
  }, [modalHeight]);

  useEffect(() => {
    const expand = (keyboardHeight: number = 0) => {
      const maxKeyboardOffset = maxModalHeight - modalHeight;
      const keyboardAvoidanceOffset = Math.min(keyboardHeight, maxKeyboardOffset);

      setIsKeyboardVisible(true);
      setSheetHeight(modalHeight + keyboardAvoidanceOffset);
      setKeyboardInset(Math.max(keyboardHeight - keyboardAvoidanceOffset, 0));
    };

    const collapse = () => {
      setSheetHeight(modalHeight);
      setKeyboardInset(0);
      setIsKeyboardVisible(false);
    };

    const handleKeyboardWillShow: KeyboardEventListener = (e) => {
      if (Platform.OS === 'ios') {
        expand(e.endCoordinates.height);
      }
    };

    const handleKeyboardDidShow: KeyboardEventListener = (e) => {
      if (Platform.OS === 'android') {
        expand(e.endCoordinates.height);
      }
    };

    const handleKeyboardWillHide: KeyboardEventListener = (e) => {
      if (Platform.OS === 'ios') {
        collapse();
      }
    };

    const handleKeyboardDidHide: KeyboardEventListener = (e) => {
      if (Platform.OS === 'android') {
        collapse();
      }
    };

    const subscriptions = [
      Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow),
      Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow),
      Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide),
      Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [maxModalHeight, modalHeight]);

  return {
    height: sheetHeight,
    keyboardInset,
    isKeyboardVisible,
  };
};

export const MobileMenuDrawer = memo(
  forwardRef<MobileMenuDrawerRef, MobileMenuDrawerProps>(
    ({ children, onVisibilityChange, showScrollToSelected = true }, ref) => {
      const [isVisible, setIsVisible] = useState(false);
      const { scrollCallback } = useSelectedNode();
      const theme = useTheme();
      const { height } = useWindowDimensions();
      const { height: sheetHeight, keyboardInset, isKeyboardVisible } = useAnimatedModalHeight();

      // Slide animation for drawer entrance/exit
      const slideAnim = useAnimatedValue(height);

      // Create a reference for the drag handle animation
      const dragY = useAnimatedValue(0);

      const openDrawer = useCallback(() => {
        dragY.setValue(0);
        slideAnim.setValue(height);
        setIsVisible(true);
        onVisibilityChange?.(true);

        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      }, [dragY, height, onVisibilityChange, slideAnim]);

      const scrollToSelectedStory = useCallback(() => {
        scrollCallback({ animated: true, id: undefined });
      }, [scrollCallback]);

      const closeDrawer = useCallback(() => {
        Keyboard.dismiss();
        onVisibilityChange?.(false);

        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setIsVisible(false);
          }
        });
      }, [height, onVisibilityChange, slideAnim]);

      // Create the pan responder for handling drag gestures
      const panResponder = useMemo(
        () =>
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
              if (isKeyboardVisible) {
                if (gestureState.dy > 20) {
                  Keyboard.dismiss();
                }

                Animated.timing(dragY, {
                  toValue: 0,
                  duration: 250,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: true,
                }).start();

                return;
              }

              if (gestureState.dy > 50) {
                closeDrawer();
              } else {
                // Only snap back if not closing
                Animated.timing(dragY, {
                  toValue: 0,
                  duration: 300,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: true,
                }).start();
              }
            },
          }),
        [closeDrawer, dragY, isKeyboardVisible]
      );

      const sheetTranslateY = useMemo(() => Animated.add(slideAnim, dragY), [dragY, slideAnim]);

      useImperativeHandle(ref, () => ({
        setMobileMenuOpen: (open: boolean) => {
          if (open) {
            openDrawer();
          } else {
            closeDrawer();
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
          alignSelf: 'center' as const,
        }),
        [theme.color.mediumdark]
      );

      const drawerContainerStyle = useMemo(
        () =>
          ({
            flex: 1,
            borderTopColor: theme.appBorderColor,
            borderTopWidth: 1,
            borderStyle: 'solid' as const,
            backgroundColor: theme.background.content,
            elevation: 8,
            boxShadow: `0 16px 32px 0 ${theme.color.border}`,
          }) satisfies ViewStyle,
        [theme.appBorderColor, theme.background.content, theme.color.border]
      );

      const dragHandleWrapperStyle = useMemo(
        () => ({
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          paddingBottom: 16,
          paddingTop: 10,
          backgroundColor: theme.background.content,
        }),
        [theme.background.content]
      );

      const childrenWrapperStyle = useMemo(
        () => ({
          flex: 1,
          backgroundColor: theme.background.content,
          paddingBottom: keyboardInset,
        }),
        [keyboardInset, theme.background.content]
      );

      const scrollToSelectedButtonWrapperStyle = useMemo(
        () =>
          ({
            position: 'absolute',
            right: 16,
            bottom: keyboardInset + 16,
            zIndex: 1,
            borderRadius: theme.input.borderRadius,
            boxShadow: `0 2px 5px 0 ${theme.color.border}`,
            elevation: 1,
          }) satisfies ViewStyle,
        [keyboardInset, theme.color.border, theme.input.borderRadius]
      );

      return (
        <Portal hostName="storybook-lite-ui-root">
          <Animated.View
            style={portalContainerStyle}
            pointerEvents={isVisible ? 'auto' : 'none'}
            accessibilityElementsHidden={!isVisible}
            importantForAccessibility={isVisible ? 'auto' : 'no-hide-descendants'}
            accessibilityViewIsModal={isVisible}
          >
            <View style={flexStyle}>
              <Pressable
                style={flexStyle}
                onPress={closeDrawer}
                accessibilityRole="button"
                accessibilityLabel="Close story list"
              />
            </View>

            <Animated.View
              style={{
                height: sheetHeight,
                transform: [{ translateY: sheetTranslateY }],
              }}
            >
              <Animated.View style={drawerContainerStyle}>
                {/* Drag handle */}
                <View {...panResponder.panHandlers} style={dragHandleWrapperStyle}>
                  <View style={handleStyle} />
                </View>

                <View style={childrenWrapperStyle}>{children}</View>
                {showScrollToSelected ? (
                  <View style={scrollToSelectedButtonWrapperStyle}>
                    <Button
                      text="Scroll to selected"
                      variant="outline"
                      size="medium"
                      onPress={scrollToSelectedStory}
                      accessibilityLabel="Scroll to selected story"
                    />
                  </View>
                ) : null}
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </Portal>
      );
    }
  )
);
