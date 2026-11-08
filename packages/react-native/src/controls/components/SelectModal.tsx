import { styled } from '@storybook/react-native-theming';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { ModalPortal } from './ModalPortal';

export interface SelectOptionItem {
  key: any;
  label: string;
}

interface SelectModalProps {
  options: SelectOptionItem[];
  value: any;
  multiple?: boolean;
  onChange: (value: any) => void;
  children: ReactNode;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scrollContent: {
    padding: 8,
    paddingHorizontal: 10,
  },
  option: {
    minHeight: 34,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    flex: 1,
    textAlign: 'left',
  },
  indicator: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkmark: {
    fontSize: 16,
  },
  footer: {
    padding: 8,
  },
  doneFooter: {
    paddingBottom: 4,
  },
  cancelFooter: {
    paddingTop: 4,
  },
  buttonText: {
    textAlign: 'center',
  },
  triggerContent: {
    pointerEvents: 'none',
  },
});

const Dialog = styled.View<{ maxHeight: number }>(({ theme, maxHeight }) => ({
  maxHeight,
  marginHorizontal: 24,
  backgroundColor: theme.background.content,
  borderColor: theme.appBorderColor,
  borderWidth: 1,
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: `0px 8px 24px 0px ${theme.color.border}`,
  elevation: 10,
}));

const OptionButton = styled.View<{ selected: boolean }>(({ theme, selected }) => ({
  borderBottomColor: theme.appBorderColor,
  backgroundColor: selected ? theme.color.secondary : undefined,
}));

const OptionLabel = styled.Text<{ selected: boolean }>(({ theme, selected }) => ({
  color: selected ? theme.color.lightest : theme.color.defaultText,
  fontSize: theme.typography.size.s2,
  fontWeight: selected ? theme.typography.weight.bold : 'normal',
}));

const Checkmark = styled.Text(({ theme }) => ({
  color: theme.color.lightest,
}));

const Footer = styled.View(({ theme }) => ({
  backgroundColor: theme.barBg,
}));

const FooterButton = styled.View<{ primary?: boolean }>(({ theme, primary }) => ({
  minHeight: 32,
  borderRadius: theme.input.borderRadius,
  backgroundColor: primary ? theme.color.secondary : theme.button.background,
  borderColor: primary ? theme.color.secondary : theme.button.border,
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 12,
}));

const FooterButtonText = styled.Text<{ primary?: boolean }>(({ theme, primary }) => ({
  color: primary ? theme.color.lightest : theme.input.color,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
}));

const optionKey = (option: SelectOptionItem) => String(option.key);

const valueKeys = (value: any, multiple: boolean) => {
  if (multiple) {
    return Array.isArray(value) ? value.map(String) : [];
  }

  return value === undefined || value === null ? [] : [String(value)];
};

export const SelectModal = ({
  options,
  value,
  multiple = false,
  onChange,
  children,
}: SelectModalProps) => {
  const { height } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(() => valueKeys(value, multiple));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedKeys(valueKeys(value, multiple));
  }, [multiple, value]);

  const selectedKeySet = useMemo(() => new Set(selectedKeys), [selectedKeys]);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const open = useCallback(() => {
    setSelectedKeys(valueKeys(value, multiple));
    setVisible(true);
  }, [multiple, value]);

  const selectOption = useCallback(
    (option: SelectOptionItem) => {
      const key = optionKey(option);

      if (!multiple) {
        onChange(option.key);
        close();
        return;
      }

      setSelectedKeys((current) =>
        current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
      );
    },
    [close, multiple, onChange]
  );

  const commitMultiSelect = useCallback(() => {
    onChange(
      options
        .filter((option) => selectedKeys.includes(optionKey(option)))
        .map((option) => option.key)
    );
    close();
  }, [close, onChange, options, selectedKeys]);

  return (
    <View>
      <ModalPortal
        transparent
        supportedOrientations={['portrait']}
        visible={visible}
        onRequestClose={close}
        animationType="none"
      >
        <TouchableWithoutFeedback accessible={false} onPress={close}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback accessible={false}>
              <Dialog maxHeight={height * 0.75}>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="always"
                >
                  {options.map((option, index) => {
                    const key = optionKey(option);
                    const selected = selectedKeySet.has(key);

                    return (
                      <TouchableOpacity
                        key={key}
                        testID={`select-modal-${option.label}`}
                        activeOpacity={0.7}
                        accessibilityLabel={option.label}
                        onPress={() => selectOption(option)}
                      >
                        <OptionButton
                          selected={selected}
                          style={[styles.option, index === options.length - 1 && styles.lastOption]}
                        >
                          <View style={styles.optionContent}>
                            <OptionLabel selected={selected} style={styles.optionText}>
                              {option.label}
                            </OptionLabel>
                            <View style={styles.indicator}>
                              {selected && <Checkmark style={styles.checkmark}>✓</Checkmark>}
                            </View>
                          </View>
                        </OptionButton>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {multiple && (
                  <Footer style={[styles.footer, styles.doneFooter]}>
                    <TouchableOpacity activeOpacity={0.7} onPress={commitMultiSelect}>
                      <FooterButton primary>
                        <FooterButtonText primary style={styles.buttonText}>
                          Done
                        </FooterButtonText>
                      </FooterButton>
                    </TouchableOpacity>
                  </Footer>
                )}

                <Footer style={[styles.footer, multiple && styles.cancelFooter]}>
                  <TouchableOpacity activeOpacity={0.7} onPress={close}>
                    <FooterButton>
                      <FooterButtonText style={styles.buttonText}>Cancel</FooterButtonText>
                    </FooterButton>
                  </TouchableOpacity>
                </Footer>
              </Dialog>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </ModalPortal>

      <TouchableOpacity activeOpacity={0.7} onPress={open}>
        <View style={styles.triggerContent}>{children}</View>
      </TouchableOpacity>
    </View>
  );
};

export default SelectModal;
