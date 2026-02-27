import { styled, useTheme } from '@storybook/react-native-theming';
import { IconButton, useStyle } from '@storybook/react-native-ui-common';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  ScrollView,
  StyleProp,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { addons } from 'storybook/manager-api';
import {
  Addon_TypesEnum,
  type Addon_BaseType,
  type Addon_Collection,
} from 'storybook/internal/types';
import { CloseIcon } from './icon/iconDataUris';
import useAnimatedValue from './useAnimatedValue';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface MobileAddonsPanelRef {
  setAddonsPanelOpen: (isOpen: boolean) => void;
}

export const MobileAddonsPanel = forwardRef<MobileAddonsPanelRef, { storyId?: string }>(
  ({ storyId }, ref) => {
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const panelHeight = useAnimatedValue(0);
    const positionBottomAnimation = useAnimatedValue(height / 2);
    const [isOpen, setIsOpen] = useState(false);

    const setMobileMenuOpen = useCallback(
      (open: boolean) => {
        setIsOpen(open);

        if (open) {
          Animated.parallel([
            Animated.timing(positionBottomAnimation, {
              toValue: 0, // Negative to move up
              duration: 350,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.cubic),
            }),

            Animated.timing(panelHeight, {
              toValue: height / 2,
              duration: 350,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.cubic),
            }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.timing(positionBottomAnimation, {
              toValue: height / 2,
              duration: 350,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.cubic),
            }),
            Animated.timing(panelHeight, {
              toValue: 0,
              duration: 350,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.cubic),
            }),
          ]).start();
        }
      },
      [height, positionBottomAnimation, panelHeight]
    );

    useEffect(() => {
      // Define keyboard show handler
      const handleKeyboardShow = ({ endCoordinates, duration, easing }) => {
        if (isOpen) {
          Animated.parallel([
            Animated.timing(panelHeight, {
              toValue: (height - endCoordinates.height) / 2,
              duration,
              useNativeDriver: false,
              easing: Easing[easing] || Easing.out(Easing.ease),
            }),
            Animated.timing(positionBottomAnimation, {
              toValue: -endCoordinates.height, // Negative to move up
              duration,
              useNativeDriver: false,
              easing: Easing[easing] || Easing.out(Easing.ease),
            }),
          ]).start();
        }
      };

      // Define keyboard hide handler
      const handleKeyboardHide = ({ duration, easing }) => {
        if (isOpen) {
          Animated.parallel([
            Animated.timing(positionBottomAnimation, {
              toValue: 0, // Back to original position
              duration,
              useNativeDriver: false,
              easing: Easing[easing] || Easing.out(Easing.ease),
            }),

            Animated.timing(panelHeight, {
              toValue: height / 2,
              duration,
              useNativeDriver: false,
              easing: Easing[easing] || Easing.out(Easing.ease),
            }),
          ]).start();
        }
      };

      // Add keyboard event listeners
      const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      const willShowSubscription = Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
      const hideSubscription = Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
      const didHideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

      // Clean up subscriptions on unmount
      return () => {
        showSubscription.remove();
        willShowSubscription.remove();
        hideSubscription.remove();
        didHideSubscription.remove();
      };
    }, [height, panelHeight, positionBottomAnimation, isOpen]);

    useImperativeHandle(ref, () => ({
      setAddonsPanelOpen: (open: boolean) => {
        if (open) {
          setMobileMenuOpen(true);
        } else {
          setMobileMenuOpen(false);
        }
      },
    }));

    return (
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: panelHeight,
          transform: [{ translateY: positionBottomAnimation }],
        }}
        pointerEvents={isOpen ? 'auto' : 'none'}
        accessibilityElementsHidden={!isOpen}
        importantForAccessibility={isOpen ? 'auto' : 'no-hide-descendants'}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              height: '100%',
              backgroundColor: theme.background.content,
              paddingTop: 10,
              borderTopColor: theme.appBorderColor,
              borderTopWidth: 1,
              paddingBottom: Platform.OS === 'android' ? 16 : 0,
            }}
          >
            <AddonsTabs
              onClose={() => {
                setMobileMenuOpen(false);
                Keyboard.dismiss();
              }}
              storyId={storyId}
            />
          </View>
        </View>
      </Animated.View>
    );
  }
);

MobileAddonsPanel.displayName = 'MobileAddonsPanel';

const addonsTabsContainerStyle = {
  flex: 1,
} satisfies StyleProp<ViewStyle>;

const addonsTabsStyle = {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: 'lightgrey',
} satisfies StyleProp<ViewStyle>;

const addonsTabsContentContainerStyle = {
  justifyContent: 'center',
} satisfies StyleProp<ViewStyle>;

const closeIconStyle = {
  marginRight: 4,
  marginBottom: 4,
  alignItems: 'center',
  justifyContent: 'center',
} satisfies StyleProp<ViewStyle>;

const addonsScrollStyle = {
  flex: 1,
} satisfies StyleProp<ViewStyle>;

const centeredStyle = {
  alignItems: 'center',
  justifyContent: 'center',
} satisfies StyleProp<ViewStyle>;

const hiddenStyle = {
  display: 'none',
} satisfies StyleProp<ViewStyle>;

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };

export const AddonsTabs = ({ onClose, storyId }: { onClose?: () => void; storyId?: string }) => {
  const panels: Addon_Collection<Addon_BaseType> = addons.getElements(Addon_TypesEnum.PANEL);
  const insets = useSafeAreaInsets();
  const [addonSelected, setAddonSelected] = useState(Object.keys(panels)[0]);

  const panelEntries = useMemo(() => Object.entries(panels), [panels]);

  const scrollContentContainerStyle = useStyle(
    () => ({
      paddingBottom: insets.bottom + 16,
    }),
    [insets]
  );

  return (
    <View style={addonsTabsContainerStyle}>
      <View style={addonsTabsStyle}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={addonsTabsContentContainerStyle}
          keyboardShouldPersistTaps="handled"
        >
          {Object.values(panels).map(({ id, title }) => {
            const resolvedTitle = typeof title === 'function' ? title({}) : title;

            return (
              <Tab
                key={id}
                active={id === addonSelected}
                onPress={() => setAddonSelected(id)}
                text={String(resolvedTitle)}
              />
            );
          })}
        </ScrollView>

        <IconButton
          style={closeIconStyle}
          hitSlop={hitSlop}
          Icon={CloseIcon}
          onPress={() => onClose?.()}
          accessibilityLabel="Close addons panel"
        />
      </View>
      <ScrollView
        key={`addons-scroll-${storyId}`}
        style={addonsScrollStyle}
        // keyboardShouldPersistTaps="handled"
        contentContainerStyle={scrollContentContainerStyle}
      >
        {!storyId ? (
          <View style={centeredStyle}>
            <Text>No Story Selected</Text>
          </View>
        ) : panelEntries.length === 0 ? (
          <View style={centeredStyle}>
            <Text>No addons loaded.</Text>
          </View>
        ) : (
          panelEntries.map(([id, p]) => (
            <View key={id} style={id === addonSelected ? undefined : hiddenStyle}>
              <PanelRenderer panel={p} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const PanelRenderer = ({ panel }: { panel: Addon_BaseType }) => {
  return panel.render({ active: true });
};

const Tab = ({ active, onPress, text }: { active: boolean; onPress: () => void; text: string }) => {
  return (
    <TabButton
      active={active}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
    >
      <TabText active={active}>{text}</TabText>
    </TabButton>
  );
};

const TabButton = styled.TouchableOpacity<{ active: boolean }>(({ theme, active }) => ({
  borderBottomWidth: active ? 2 : 0,
  borderBottomColor: active ? theme.barSelectedColor : undefined,
  overflow: 'hidden',
  paddingHorizontal: 15,
  justifyContent: 'center',
  alignItems: 'center',
}));

const TabText = styled.Text<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.barSelectedColor : theme.color.mediumdark,
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 12,
  lineHeight: 12,
}));
