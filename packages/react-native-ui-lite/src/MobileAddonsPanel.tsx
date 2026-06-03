import { styled, useTheme } from '@storybook/react-native-theming';
import { IconButton, useStyle } from '@storybook/react-native-ui-common';
import type { Parameters } from 'storybook/internal/csf';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardEvent,
  Platform,
  ScrollView,
  StyleProp,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
  useAnimatedValue,
} from 'react-native';
import { addons } from 'storybook/manager-api';
import {
  Addon_TypesEnum,
  type Addon_BaseType,
  type Addon_Collection,
} from 'storybook/internal/types';
import { CloseIcon } from './icon/iconDataUris';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface MobileAddonsPanelRef {
  setAddonsPanelOpen: (isOpen: boolean) => void;
}

type MobileAddonsPanelProps = { storyId?: string; parameters?: Parameters };

export const MobileAddonsPanel = forwardRef<MobileAddonsPanelRef, MobileAddonsPanelProps>(
  ({ storyId, parameters }, ref) => {
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const defaultPanelHeight = height / 2;
    const positionBottomAnimation = useAnimatedValue(height / 2);
    const [panelHeight, setPanelHeight] = useState(defaultPanelHeight);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setPanelHeight(defaultPanelHeight);
    }, [defaultPanelHeight]);

    const setMobileMenuOpen = useCallback(
      (open: boolean) => {
        setIsOpen(open);

        if (open) {
          setPanelHeight(defaultPanelHeight);
          positionBottomAnimation.setValue(defaultPanelHeight);
          Animated.timing(positionBottomAnimation, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.cubic),
          }).start();
        } else {
          Animated.timing(positionBottomAnimation, {
            toValue: defaultPanelHeight,
            duration: 350,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.cubic),
          }).start(() => {
            setPanelHeight(defaultPanelHeight);
          });
        }
      },
      [defaultPanelHeight, positionBottomAnimation]
    );

    useEffect(() => {
      const handleKeyboardShow = ({ endCoordinates }: KeyboardEvent) => {
        if (isOpen) {
          setPanelHeight((height - endCoordinates.height) / 2);
          positionBottomAnimation.setValue(-endCoordinates.height);
        }
      };

      const handleKeyboardHide = () => {
        if (isOpen) {
          setPanelHeight(defaultPanelHeight);
          positionBottomAnimation.setValue(0);
        }
      };

      const showSubscription = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        handleKeyboardShow
      );
      const hideSubscription = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        handleKeyboardHide
      );

      // Clean up subscriptions on unmount
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [defaultPanelHeight, height, positionBottomAnimation, isOpen]);

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
              parameters={parameters}
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

type AddonsTabsProps = {
  onClose?: () => void;
  storyId?: string;
  parameters?: Parameters;
};

export const AddonsTabs = ({ onClose, storyId, parameters }: AddonsTabsProps) => {
  const panels = useMemo<Addon_Collection<Addon_BaseType>>(() => {
    const allPanels: Addon_Collection<Addon_BaseType> = addons.getElements(Addon_TypesEnum.PANEL);

    return Object.fromEntries(
      Object.entries(allPanels).filter(([, p]) => !p.paramKey || !parameters?.[p.paramKey]?.disable)
    );
  }, [parameters]);

  const insets = useSafeAreaInsets();
  const [addonSelected, setAddonSelected] = useState(Object.keys(panels)[0]);
  const panelEntries = useMemo(() => Object.entries(panels), [panels]);
  const activeAddonId = panels[addonSelected] ? addonSelected : panelEntries[0]?.[0];

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
                active={id === activeAddonId}
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
            <View key={id} style={id === activeAddonId ? undefined : hiddenStyle}>
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
