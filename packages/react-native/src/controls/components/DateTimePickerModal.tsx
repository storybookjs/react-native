import { styled, useTheme } from '@storybook/react-native-theming';
import { useEffect, useState, type ComponentType } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import type { DateTimePickerModule } from '../optionalNativeModules';
import { ModalPortal } from './ModalPortal';

export type PickerMode = 'date' | 'time';

const Sheet = styled.View(({ theme }) => ({
  backgroundColor: theme.background.content,
  borderColor: theme.appBorderColor,
  borderTopWidth: 1,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  paddingTop: 8,
  paddingBottom: 32,
  paddingHorizontal: 16,
}));

const Button = styled.View<{ primary?: boolean }>(({ theme, primary }) => ({
  minHeight: 36,
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
 * A bottom sheet around the native iOS date/time picker view with Cancel and Confirm buttons. The
 * picked value is only applied on Confirm.
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
  const [pending, setPending] = useState(date);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (visible) setPending(date);
  }, [visible, date]);

  const NativePicker = Picker as ComponentType<any>;

  return (
    <ModalPortal
      transparent
      supportedOrientations={['portrait', 'landscape']}
      visible={visible}
      onRequestClose={onCancel}
      animationType="fade"
    >
      <TouchableWithoutFeedback accessible={false} onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback accessible={false}>
            <Sheet>
              <NativePicker
                testID="storybook-date-time-picker"
                value={pending}
                mode={mode}
                display="spinner"
                themeVariant={theme.base === 'dark' ? 'dark' : 'light'}
                textColor={theme.color.defaultText}
                onChange={(_event: unknown, picked?: Date) => {
                  if (picked) setPending(picked);
                }}
              />
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={onCancel}>
                  <Button>
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </ModalPortal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: { flex: 1 },
  confirm: { marginLeft: 8 },
});
