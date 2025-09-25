import { styled, useTheme } from '@storybook/react-native-theming';
import { IconButton } from '@storybook/react-native-ui-common';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { addons } from 'storybook/internal/manager-api';
import { Addon_TypesEnum } from 'storybook/internal/types';
import { CloseIcon } from './icon/iconDataUris';
import useAnimatedValue from './useAnimatedValue';

export interface MobileAddonsPanelRef {
  setAddonsPanelOpen: (isOpen: boolean) => void;
}

export const MobileAddonsPanel = forwardRef<MobileAddonsPanelRef, { storyId?: string }>(
  ({ storyId }, ref) => {
    const theme = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { height } = useWindowDimensions();
    const panelHeight = useAnimatedValue(height / 2);
    const positionBottomAnimation = useAnimatedValue(0);

    useEffect(() => {
      // Define keyboard show handler
      const handleKeyboardShow = ({ endCoordinates, duration, easing }) => {
        Animated.parallel([
          Animated.timing(positionBottomAnimation, {
            toValue: -endCoordinates.height, // Negative to move up
            duration,
            useNativeDriver: false,
            easing: Easing[easing] || Easing.out(Easing.ease),
          }),

          Animated.timing(panelHeight, {
            toValue: (height - endCoordinates.height) / 2,
            duration: duration + 250,
            useNativeDriver: false,
            easing: Easing[easing] || Easing.out(Easing.ease),
          }),
        ]).start();
      };

      // Define keyboard hide handler
      const handleKeyboardHide = ({ duration, easing }) => {
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
    }, [height, panelHeight, positionBottomAnimation]);

    useImperativeHandle(ref, () => ({
      setAddonsPanelOpen: (open: boolean) => {
        if (open) {
          setMobileMenuOpen(true);
        } else {
          setMobileMenuOpen(false);
        }
      },
    }));

    if (!mobileMenuOpen) {
      return null;
    }

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
      >
        <SafeAreaView
          style={{
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
              }}
              storyId={storyId}
            />
          </View>
        </SafeAreaView>
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

const scrollContentContainerStyle = {
  paddingBottom: 16,
} satisfies StyleProp<ViewStyle>;
const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };

export const AddonsTabs = ({ onClose, storyId }: { onClose?: () => void; storyId?: string }) => {
  const panels = addons.getElements(Addon_TypesEnum.PANEL);

  const [addonSelected, setAddonSelected] = useState(Object.keys(panels)[0]);

  const panel = useMemo(() => {
    if (!storyId) {
      return (
        <View style={centeredStyle}>
          <Text>No Story Selected</Text>
        </View>
      );
    }

    if (Object.keys(panels).length === 0) {
      return (
        <View style={centeredStyle}>
          <Text>No addons loaded.</Text>
        </View>
      );
    }

    return panels[addonSelected].render({ active: true });
  }, [addonSelected, panels, storyId]);

  return (
    <View style={addonsTabsContainerStyle}>
      <View style={addonsTabsStyle}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={addonsTabsContentContainerStyle}
        >
          {Object.values(panels).map(({ id, title }) => {
            const resolvedTitle = typeof title === 'function' ? title({}) : title;

            return (
              <Tab
                key={id}
                active={id === addonSelected}
                onPress={() => setAddonSelected(id)}
                text={resolvedTitle}
              />
            );
          })}
        </ScrollView>

        <IconButton
          style={closeIconStyle}
          hitSlop={hitSlop}
          Icon={CloseIcon}
          onPress={() => onClose?.()}
        />
      </View>
      <ScrollView
        style={addonsScrollStyle}
        // keyboardShouldPersistTaps="handled"
        contentContainerStyle={scrollContentContainerStyle}
      >
        {panel}
      </ScrollView>
    </View>
  );
};

const Tab = ({ active, onPress, text }: { active: boolean; onPress: () => void; text: string }) => {
  return (
    <TabButton active={active} onPress={onPress}>
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
