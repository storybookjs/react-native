// NOTE This is adapted from react-native-modal-selector https://github.com/peacechen/react-native-modal-selector/blob/master/index.js

import { useTheme } from '@storybook/react-native-theming';
import { ComponentType, ReactNode, useCallback, useMemo, useState } from 'react';

import {
  FlatList,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { ModalPortal } from './ModalPortal';

const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const MODAL_HORIZONTAL_MARGIN = 24;

type SupportedOrientation =
  | 'portrait'
  | 'portrait-upside-down'
  | 'landscape'
  | 'landscape-left'
  | 'landscape-right';

interface SelectModalProps {
  data: any[];
  onChange?: (item: any | any[]) => void;
  onModalOpen?: () => void;
  onModalClose?: () => void;
  keyExtractor?: (item: any) => string;
  labelExtractor?: (item: any) => string;
  visible?: boolean;
  closeOnChange?: boolean;
  initValue?: string | string[];
  listType?: 'SCROLLVIEW' | 'FLATLIST';
  animationType?: 'none' | 'slide' | 'fade';
  style?: StyleProp<ViewStyle>;
  selectStyle?: StyleProp<ViewStyle>;
  selectTextStyle?: StyleProp<TextStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  optionTextStyle?: StyleProp<TextStyle>;
  optionContainerStyle?: StyleProp<ViewStyle>;
  sectionStyle?: StyleProp<ViewStyle>;
  childrenContainerStyle?: StyleProp<ViewStyle>;
  touchableStyle?: StyleProp<ViewStyle>;
  touchableActiveOpacity?: number;
  sectionTextStyle?: StyleProp<TextStyle>;
  selectedItemTextStyle?: StyleProp<TextStyle>;
  cancelContainerStyle?: StyleProp<ViewStyle>;
  cancelStyle?: StyleProp<ViewStyle>;
  cancelTextStyle?: StyleProp<TextStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  initValueTextStyle?: StyleProp<TextStyle>;
  cancelText?: string;
  disabled?: boolean;
  supportedOrientations?: SupportedOrientation[];
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';
  backdropPressToClose?: boolean;
  openButtonContainerAccessible?: boolean;
  listItemAccessible?: boolean;
  cancelButtonAccessible?: boolean;
  scrollViewAccessible?: boolean;
  scrollViewAccessibilityLabel?: string;
  cancelButtonAccessibilityLabel?: string;
  passThruProps?: any;
  selectTextPassThruProps?: any;
  optionTextPassThruProps?: any;
  cancelTextPassThruProps?: any;
  scrollViewPassThruProps?: any;
  modalOpenerHitSlop?: any;
  customSelector?: ReactNode;
  selectedKey?: any;
  children?: ReactNode;
  header?: ReactNode;
  optionsTestIDPrefix?: string;
  onEndReached?: () => void;
  multiselect?: boolean;
  selectedSeparator?: string;
  maxSelectedItems?: number;
  selectedItemIndicatorStyle?: StyleProp<ViewStyle>;
  selectedItemIndicatorColor?: string;
  doneText?: string;
  onDone?: (selectedItems: any[]) => void;
}

const styles = StyleSheet.create({
  overlayStyle: {
    flex: 1,
    padding: '5%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  optionContainer: {
    borderRadius: BORDER_RADIUS,
    flexShrink: 1,
    marginBottom: 8,
    padding: PADDING,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  cancelContainer: {
    alignSelf: 'stretch',
    marginTop: 8,
  },

  selectStyle: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: PADDING,
    borderRadius: BORDER_RADIUS,
  },

  selectTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE,
  },

  cancelStyle: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: PADDING,
  },

  cancelTextStyle: {
    textAlign: 'center',
    color: '#333',
    fontSize: FONT_SIZE,
  },

  optionStyle: {
    paddingVertical: PADDING,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  optionTextStyle: {
    fontSize: FONT_SIZE,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },

  sectionStyle: {
    padding: PADDING * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  sectionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
  },

  initValueTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
    color: '#d3d3d3',
  },

  selectedItemIndicator: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  checkmark: {
    fontSize: FONT_SIZE,
    color: '#333',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  doneContainer: {
    alignSelf: 'stretch',
    marginTop: 8,
  },

  doneButton: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: PADDING,
  },

  doneButtonText: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
    color: '#333',
  },
});

let componentIndex = 0;

export const SelectModal = ({
  data = [],
  onChange,
  onModalOpen,
  onModalClose,
  keyExtractor = (item: any) => String(item.key || item.id || item),
  labelExtractor = (item: any) => String(item.label || item.name || item),
  closeOnChange = true,
  initValue = '',
  listType = 'SCROLLVIEW',
  animationType = 'slide',
  style,
  selectStyle: selectStyleProp,
  selectTextStyle: selectTextStyleProp,
  optionStyle: optionStyleProp,
  optionTextStyle: optionTextStyleProp,
  optionContainerStyle,
  sectionStyle: sectionStyleProp,
  childrenContainerStyle,
  touchableStyle,
  touchableActiveOpacity = 0.2,
  sectionTextStyle: sectionTextStyleProp,
  cancelContainerStyle,
  cancelStyle: cancelStyleProp,
  cancelTextStyle: cancelTextStyleProp,
  overlayStyle: overlayStyleProp,
  initValueTextStyle: initValueTextStyleProp,
  cancelText = 'Cancel',
  disabled = false,
  supportedOrientations = ['portrait'],
  keyboardShouldPersistTaps = 'always',
  backdropPressToClose = true,
  openButtonContainerAccessible = true,
  listItemAccessible = true,
  cancelButtonAccessible = true,
  scrollViewAccessible = true,
  scrollViewAccessibilityLabel,
  cancelButtonAccessibilityLabel,
  passThruProps,
  selectTextPassThruProps,
  optionTextPassThruProps,
  cancelTextPassThruProps,
  scrollViewPassThruProps,
  modalOpenerHitSlop,
  customSelector,
  children,
  header,
  optionsTestIDPrefix = 'select-modal',
  onEndReached,
  multiselect = false,
  selectedSeparator = ', ',
  maxSelectedItems,
  selectedItemIndicatorStyle,
  selectedItemIndicatorColor,
  doneText = 'Done',
  onDone,
}: SelectModalProps) => {
  const theme = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<string | string[]>(
    multiselect ? (Array.isArray(initValue) ? initValue : []) : initValue || ''
  );
  const [selectedItems, setSelectedItems] = useState<any[]>(() => {
    if (multiselect) {
      if (Array.isArray(initValue)) {
        return data.filter((item) => initValue.includes(String(keyExtractor(item))));
      }
      return [];
    }
    // For single select, initialize with the item matching initValue
    const initialItem = data.find((item) => String(keyExtractor(item)) === String(initValue));
    return initialItem ? [initialItem] : [];
  });

  const selectedItemsMap = useMemo(() => {
    if (multiselect) {
      return (selectedItems || []).reduce((acc: Record<string, boolean>, item) => {
        acc[keyExtractor(item)] = true;
        return acc;
      }, {});
    } else {
      // For single select, find the currently selected item
      const selectedItem = data.find((item) => labelExtractor(item) === selected);
      return selectedItem ? { [keyExtractor(selectedItem)]: true } : {};
    }
  }, [selectedItems, keyExtractor, multiselect, selected, data, labelExtractor]);

  const themedStyles = useMemo(
    () => ({
      modalContent: {
        maxHeight: windowHeight * 0.75,
        marginHorizontal: MODAL_HORIZONTAL_MARGIN,
        backgroundColor: theme.background.content,
        borderColor: theme.appBorderColor,
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden' as const,
        boxShadow: `0px 8px 24px 0px ${theme.color.border}`,
        elevation: 10,
      } satisfies ViewStyle,
      optionContainer: {
        backgroundColor: theme.background.content,
        borderRadius: 0,
        borderBottomColor: theme.appBorderColor,
        borderBottomWidth: 1,
        marginBottom: 0,
      } satisfies ViewStyle,
      optionStyle: {
        minHeight: 34,
        borderBottomColor: theme.appBorderColor,
      } satisfies ViewStyle,
      selectedOptionStyle: {
        backgroundColor: theme.color.secondary,
      } satisfies ViewStyle,
      optionTextStyle: {
        color: theme.color.defaultText,
        fontSize: theme.typography.size.s2,
      } satisfies TextStyle,
      selectedOptionTextStyle: {
        color: theme.color.lightest,
        fontWeight: theme.typography.weight.bold,
      } satisfies TextStyle,
      cancelContainer: {
        marginTop: 0,
        padding: 8,
        backgroundColor: theme.barBg,
      } satisfies ViewStyle,
      doneContainer: {
        paddingBottom: 4,
      } satisfies ViewStyle,
      cancelAfterDoneContainer: {
        paddingTop: 4,
      } satisfies ViewStyle,
      actionButton: {
        minHeight: 32,
        borderRadius: theme.input.borderRadius,
        backgroundColor: theme.button.background,
        borderColor: theme.button.border,
        borderWidth: 1,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingHorizontal: 12,
        paddingVertical: 0,
      } satisfies ViewStyle,
      primaryActionButton: {
        backgroundColor: theme.color.secondary,
        borderColor: theme.color.secondary,
      } satisfies ViewStyle,
      actionText: {
        color: theme.input.color,
        fontSize: theme.typography.size.s1,
        fontWeight: theme.typography.weight.bold,
      } satisfies TextStyle,
      primaryActionText: {
        color: theme.color.lightest,
      } satisfies TextStyle,
      checkmark: {
        color: theme.color.lightest,
      } satisfies TextStyle,
    }),
    [
      theme.appBorderColor,
      theme.background.content,
      theme.barBg,
      theme.button.background,
      theme.button.border,
      theme.color.border,
      theme.color.defaultText,
      theme.color.lightest,
      theme.color.secondary,
      theme.input.borderRadius,
      theme.input.color,
      theme.typography.size.s1,
      theme.typography.size.s2,
      theme.typography.weight.bold,
      windowHeight,
    ]
  );

  const open = useCallback(() => {
    if (!disabled) {
      setModalVisible(true);
      onModalOpen?.();
    }
  }, [disabled, onModalOpen]);

  const handleLongPress = useCallback(() => {
    open();
  }, [open]);

  const close = useCallback(() => {
    setModalVisible(false);
    onModalClose?.();
  }, [onModalClose]);

  const handleDone = useCallback(() => {
    if (multiselect) {
      onChange?.(selectedItems);
      onDone?.(selectedItems);
    }
    close();
  }, [multiselect, selectedItems, onChange, onDone, close]);

  const handleChange = useCallback(
    (item: any) => {
      if (multiselect) {
        const itemKey = keyExtractor(item);
        const isSelected = selectedItemsMap[itemKey];

        let newSelectedItems;
        if (isSelected) {
          newSelectedItems = selectedItems.filter((i) => keyExtractor(i) !== itemKey);
        } else {
          if (maxSelectedItems && selectedItems.length >= maxSelectedItems) {
            return;
          }
          newSelectedItems = [...selectedItems, item];
        }

        setSelectedItems(newSelectedItems);
        setSelected(newSelectedItems.map(labelExtractor).join(selectedSeparator));

        if (!closeOnChange) {
          onChange?.(newSelectedItems);
        }
      } else {
        setSelected(labelExtractor(item));
        if (closeOnChange) {
          close();
        }
        onChange?.(item);
      }
    },
    [
      multiselect,
      selectedItems,
      selectedItemsMap,
      keyExtractor,
      labelExtractor,
      maxSelectedItems,
      closeOnChange,
      onChange,
      close,
      selectedSeparator,
    ]
  );

  const renderOption = useCallback(
    (option: any, isLastItem: boolean, isFirstItem: boolean) => {
      const optionLabel = labelExtractor(option);
      const optionKey = keyExtractor(option);
      const isSelected = selectedItemsMap[optionKey];

      return (
        <TouchableOpacity
          key={optionKey}
          testID={`${optionsTestIDPrefix}-${optionLabel}`}
          onPress={() => handleChange(option)}
          activeOpacity={multiselect ? 1 : touchableActiveOpacity}
          accessible={listItemAccessible}
          accessibilityLabel={option.accessibilityLabel}
          importantForAccessibility={isFirstItem ? 'yes' : 'no'}
          {...passThruProps}
        >
          <View
            style={[
              styles.optionStyle,
              themedStyles.optionStyle,
              optionStyleProp,
              isSelected && themedStyles.selectedOptionStyle,
              isLastItem && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.optionRow}>
              <Text
                style={[
                  styles.optionTextStyle,
                  themedStyles.optionTextStyle,
                  optionTextStyleProp,
                  isSelected && themedStyles.selectedOptionTextStyle,
                ]}
                {...optionTextPassThruProps}
              >
                {optionLabel}
              </Text>
              <View style={[styles.selectedItemIndicator, selectedItemIndicatorStyle]}>
                {isSelected && (
                  <Text
                    style={[
                      styles.checkmark,
                      themedStyles.checkmark,
                      selectedItemIndicatorColor && { color: selectedItemIndicatorColor },
                    ]}
                  >
                    ✓
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [
      keyExtractor,
      labelExtractor,
      handleChange,
      touchableActiveOpacity,
      multiselect,
      listItemAccessible,
      passThruProps,
      optionStyleProp,
      optionTextStyleProp,
      optionTextPassThruProps,
      optionsTestIDPrefix,
      selectedItemsMap,
      selectedItemIndicatorStyle,
      selectedItemIndicatorColor,
      themedStyles,
    ]
  );

  const renderSection = useCallback(
    (section: any) => {
      const sectionLabel = labelExtractor(section);

      return (
        <View key={keyExtractor(section)} style={[styles.sectionStyle, sectionStyleProp]}>
          <Text style={[styles.sectionTextStyle, sectionTextStyleProp]}>{sectionLabel}</Text>
        </View>
      );
    },
    [keyExtractor, labelExtractor, sectionStyleProp, sectionTextStyleProp]
  );

  const renderFlatlistOption = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      if (item.section) {
        return renderSection(item);
      }

      return renderOption(item, index === data.length - 1, index === 0);
    },
    [renderSection, renderOption, data.length]
  );

  const renderOptionList = useCallback(() => {
    const OverlayComponent: ComponentType<ViewProps> = backdropPressToClose
      ? TouchableWithoutFeedback
      : View;

    const key = backdropPressToClose ? `modalSelector${componentIndex++}` : undefined;
    const overlayProps = backdropPressToClose
      ? {
          accessible: false,
          onPress: close,
        }
      : {
          style: { flex: 1 },
        };

    const optionsContainerStyle = {
      paddingHorizontal: 10,
      ...(scrollViewPassThruProps?.horizontal && { flexDirection: 'row' as const }),
    };

    return (
      <OverlayComponent key={key} {...overlayProps}>
        <View style={[styles.overlayStyle, overlayStyleProp]}>
          <View style={themedStyles.modalContent}>
            <View
              style={[styles.optionContainer, themedStyles.optionContainer, optionContainerStyle]}
            >
              {header}
              {listType === 'FLATLIST' ? (
                <FlatList
                  data={data}
                  keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                  accessible={scrollViewAccessible}
                  accessibilityLabel={scrollViewAccessibilityLabel}
                  keyExtractor={keyExtractor}
                  renderItem={renderFlatlistOption}
                  onEndReached={onEndReached}
                />
              ) : (
                <ScrollView
                  keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                  accessible={scrollViewAccessible}
                  accessibilityLabel={scrollViewAccessibilityLabel}
                  {...scrollViewPassThruProps}
                >
                  <View style={optionsContainerStyle}>
                    {data.map((item, index) =>
                      item.section
                        ? renderSection(item)
                        : renderOption(item, index === data.length - 1, index === 0)
                    )}
                  </View>
                </ScrollView>
              )}
            </View>

            {multiselect && (
              <View
                style={[
                  styles.doneContainer,
                  themedStyles.cancelContainer,
                  themedStyles.doneContainer,
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.doneButton,
                    themedStyles.actionButton,
                    themedStyles.primaryActionButton,
                  ]}
                  onPress={handleDone}
                  activeOpacity={touchableActiveOpacity}
                >
                  <Text
                    style={[
                      styles.doneButtonText,
                      themedStyles.actionText,
                      themedStyles.primaryActionText,
                    ]}
                  >
                    {doneText}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={[
                styles.cancelContainer,
                themedStyles.cancelContainer,
                multiselect && themedStyles.cancelAfterDoneContainer,
                cancelContainerStyle,
              ]}
            >
              <TouchableOpacity
                onPress={close}
                activeOpacity={touchableActiveOpacity}
                accessible={cancelButtonAccessible}
                accessibilityLabel={cancelButtonAccessibilityLabel}
              >
                <View style={[styles.cancelStyle, themedStyles.actionButton, cancelStyleProp]}>
                  <Text
                    style={[styles.cancelTextStyle, themedStyles.actionText, cancelTextStyleProp]}
                    {...cancelTextPassThruProps}
                  >
                    {cancelText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </OverlayComponent>
    );
  }, [
    data,
    backdropPressToClose,
    close,
    scrollViewPassThruProps,
    overlayStyleProp,
    optionContainerStyle,
    header,
    listType,
    keyboardShouldPersistTaps,
    scrollViewAccessible,
    scrollViewAccessibilityLabel,
    keyExtractor,
    renderFlatlistOption,
    onEndReached,
    renderSection,
    renderOption,
    cancelContainerStyle,
    touchableActiveOpacity,
    cancelButtonAccessible,
    cancelButtonAccessibilityLabel,
    cancelStyleProp,
    cancelTextStyleProp,
    cancelTextPassThruProps,
    cancelText,
    multiselect,
    handleDone,
    doneText,
    themedStyles,
  ]);

  const renderChildren = useCallback(() => {
    if (children) {
      return children;
    }

    const initSelectStyle =
      selected === initValue
        ? [styles.initValueTextStyle, initValueTextStyleProp]
        : [styles.selectTextStyle, selectTextStyleProp];

    return (
      <View style={[styles.selectStyle, selectStyleProp]}>
        <Text style={initSelectStyle} {...selectTextPassThruProps}>
          {selected}
        </Text>
      </View>
    );
  }, [
    children,
    selected,
    initValue,
    initValueTextStyleProp,
    selectTextStyleProp,
    selectStyleProp,
    selectTextPassThruProps,
  ]);

  return (
    <View style={style} {...passThruProps}>
      <ModalPortal
        transparent
        supportedOrientations={supportedOrientations}
        visible={modalVisible}
        onRequestClose={close}
        animationType={animationType}
        onDismiss={() => selectedItems.length > 0 && onChange?.(selectedItems)}
      >
        {renderOptionList()}
      </ModalPortal>

      {customSelector || (
        <TouchableOpacity
          hitSlop={modalOpenerHitSlop}
          activeOpacity={touchableActiveOpacity}
          style={touchableStyle}
          onPress={open}
          onLongPress={handleLongPress}
          disabled={disabled}
          accessible={openButtonContainerAccessible}
        >
          <View style={childrenContainerStyle} pointerEvents="none">
            {renderChildren()}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SelectModal;
