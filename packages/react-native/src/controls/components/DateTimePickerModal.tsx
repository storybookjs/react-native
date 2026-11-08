import { styled, useTheme } from '@storybook/react-native-theming';
import { useContext, useEffect, useState, type ComponentType } from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import type { DateTimePickerModule } from '../optionalNativeModules';

export type PickerMode = 'date' | 'time';

const ANIMATION_DURATION = 250;
const BACKDROP_OPACITY = 0.4;

const Sheet = styled.View(({ theme }) => ({
  backgroundColor: theme.background.content,
  borderColor: theme.appBorderColor,
  borderTopWidth: 1,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  paddingTop: 8,
  paddingHorizontal: 16,
}));

const Button = styled.View<{ primary?: boolean }>(({ theme, primary }) => ({
  minHeight: 44,
  borderRadius: theme.input.borderRadius,
  backgroundColor: primary ? theme.color.secondary : theme.button.background,
  borderColor: primary ? theme.color.secondary : theme.button.border,
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 12,
}));

const ButtonText = styled.Text<{ primary?: boolean }>(({ theme, primary }) => ({
  color: primary ? theme.color.lightest : theme.input.color,
  fontSize: theme.typography.size.s2,
  fontWeight: theme.typography.weight.bold,
}));

/**
 * A bottom sheet around the native iOS date/time picker, with Cancel and Confirm buttons, in place
 * of react-native-modal-datetime-picker. Like that package it:
 *
 * - takes the value when it opens, so a change to the arg while it's open doesn't reset what's been
 *   picked, and opening it again shows the current value;
 * - only applies the picked value on Confirm; Cancel, the backdrop and the hardware back action
 *   discard it;
 * - fades the backdrop and slides the sheet, and stays mounted until the hide animation ends;
 * - keeps the buttons above the home indicator.
 *
 * Unlike it, it follows the Storybook theme rather than the system appearance.
 */
export const DateTimePickerModal = ({
  Picker,
  date,
  mode,
  visible,
  onConfirm,
  onCancel,
}: {
  Picker: DateTimePickerModule['default'];
  date: Date;
  mode: PickerMode;
  visible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}) => {
  const theme = useTheme();
  const insets = useContext(SafeAreaInsetsContext);
  const [animation] = useState(() => new Animated.Value(0));
  const [{ backdropOpacity, translateY }] = useState(() => ({
    backdropOpacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, BACKDROP_OPACITY],
    }),
    translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }),
  }));

  const [pending, setPending] = useState(date);
  const [modalVisible, setModalVisible] = useState(visible);
  const [wasVisible, setWasVisible] = useState(visible);

  // Take the current value as the sheet opens, during render, so the first frame already shows it.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setPending(date);
      setModalVisible(true);
    }
  }

  useEffect(() => {
    if (!modalVisible) return;

    const timing = Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.quad),
      // The native driver makes the content flash inside a Modal.
      useNativeDriver: false,
    });

    timing.start(({ finished }) => {
      if (finished && !visible) setModalVisible(false);
    });

    return () => timing.stop();
  }, [animation, modalVisible, visible]);

  const NativePicker = Picker as ComponentType<any>;

  return (
    <Modal
      transparent
      animationType="none"
      supportedOrientations={['portrait', 'landscape']}
      visible={modalVisible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback accessible={false} onPress={onCancel}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.content, { transform: [{ translateY }] }]}
      >
        <Sheet
          accessibilityViewIsModal
          style={{ paddingBottom: Math.max(insets?.bottom ?? 0, 8) + 8 }}
        >
          <NativePicker
            testID="storybook-date-time-picker"
            value={pending}
            mode={mode}
            display="spinner"
            themeVariant={theme.base === 'dark' ? 'dark' : 'light'}
            textColor={theme.color.defaultText}
            accentColor={theme.color.secondary}
            onChange={(_event: unknown, picked?: Date) => {
              if (picked) setPending(picked);
            }}
          />
          <View style={styles.buttons}>
            <TouchableOpacity
              testID="storybook-date-time-picker-cancel"
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={styles.button}
              activeOpacity={0.7}
              onPress={onCancel}
            >
              <Button>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              testID="storybook-date-time-picker-confirm"
              accessibilityRole="button"
              accessibilityLabel="Confirm"
              style={[styles.button, styles.confirm]}
              activeOpacity={0.7}
              onPress={() => onConfirm(pending)}
            >
              <Button primary>
                <ButtonText primary>Confirm</ButtonText>
              </Button>
            </TouchableOpacity>
          </View>
        </Sheet>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: { flex: 1 },
  confirm: { marginLeft: 8 },
});
