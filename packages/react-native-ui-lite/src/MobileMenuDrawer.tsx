import { useTheme } from '@storybook/react-native-theming';
import {
  forwardRef,
  memo,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Keyboard,
  useWindowDimensions,
  Modal,
  PanResponder,
  PanResponderInstance,
  Pressable,
  View,
  ViewStyle,
  KeyboardEventListener,
  Platform,
} from 'react-native';

import { useSelectedNode } from './SelectedNodeProvider';
import useAnimatedValue from './useAnimatedValue';

const flexStyle: ViewStyle = { flex: 1 };

interface MobileMenuDrawerProps {
  children: ReactNode | ReactNode[];
}

export interface MobileMenuDrawerRef {
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const useAnimatedModalHeight = () => {
  const { height } = useWindowDimensions();
  const animatedHeight = useAnimatedValue(0.65 * height);

  useEffect(() => {
    const modalHeight = 0.65 * height;
    const maxModalHeight = 0.85 * height;

    const expand = (duration: number = 250) =>
      Animated.timing(animatedHeight, {
        toValue: maxModalHeight,
        duration,
        useNativeDriver: false,
      }).start();

    const collapse = (duration: number = 250) =>
      Animated.timing(animatedHeight, {
        toValue: modalHeight,
        duration,
        useNativeDriver: false,
      }).start();

    const handleKeyboardWillShow: KeyboardEventListener = (e) => {
      if (Platform.OS === 'ios') {
        expand(e.duration);
      }
    };

    const handleKeyboardDidShow: KeyboardEventListener = (e) => {
      if (Platform.OS === 'android') {
        expand();
      }
    };

    const handleKeyboardWillHide: KeyboardEventListener = (e) => {
      if (Platform.OS === 'ios') {
        collapse(e.duration);
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
  }, [animatedHeight, height]);

  return animatedHeight;
};

export const MobileMenuDrawer = memo(
  forwardRef<MobileMenuDrawerRef, MobileMenuDrawerProps>(({ children }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollToSelectedNode } = useSelectedNode();
    const theme = useTheme();
    const animatedHeight = useAnimatedModalHeight();

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
        alignSelf: 'center' as const,
        marginVertical: 8,
      }),
      [theme.color.mediumdark]
    );

    const drawerContainerStyle = useMemo(
      () => ({
        flex: 1,
        borderTopColor: theme.appBorderColor,
        borderTopWidth: 1,
        borderStyle: 'solid' as const,
        backgroundColor: theme.background.content,
        elevation: 8,
      }),
      [theme.appBorderColor, theme.background.content]
    );

    const dragHandleWrapperStyle = useMemo(
      () => ({
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: theme.background.content,
      }),
      [theme.background.content]
    );

    const childrenWrapperStyle = useMemo(
      () => ({
        flex: 1,
        backgroundColor: theme.background.content,
      }),
      [theme.background.content]
    );

    return (
      <Modal
        visible={mobileMenuOpen}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <Animated.View style={flexStyle}>
          <View style={flexStyle}>
            <Pressable style={flexStyle} onPress={() => setMobileMenuOpen(false)}></Pressable>
          </View>

          <Animated.View style={{ height: animatedHeight }}>
            <Animated.View style={[drawerContainerStyle, { transform: [{ translateY: dragY }] }]}>
              {/* Drag handle */}
              <View {...panResponder.panHandlers} style={dragHandleWrapperStyle}>
                <View style={handleStyle} />
              </View>

              <View style={childrenWrapperStyle}>{children}</View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  })
);
