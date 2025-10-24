import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { addons } from 'storybook/manager-api';
import { styled, useTheme } from '@storybook/react-native-theming';
import { Addon_TypesEnum } from 'storybook/internal/types';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Platform, StyleProp, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, useStyle } from '@storybook/react-native-ui-common';
import { CloseIcon } from './icon/CloseIcon';

export interface MobileAddonsPanelRef {
  setAddonsPanelOpen: (isOpen: boolean) => void;
}

const bottomSheetStyle = {
  paddingTop: 8,
} satisfies StyleProp<ViewStyle>;

const contentStyle = {
  flex: 1,
} satisfies StyleProp<ViewStyle>;

export const MobileAddonsPanel = forwardRef<MobileAddonsPanelRef, { storyId?: string }>(
  ({ storyId }, ref) => {
    const theme = useTheme();
    const reducedMotion = useReducedMotion();

    const addonsPanelBottomSheetRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();

    const animatedPosition = useSharedValue(0);

    // bringing in animated keyboard disables android resizing
    // TODO replicate functionality without this
    useAnimatedKeyboard();

    useImperativeHandle(ref, () => ({
      setAddonsPanelOpen: (open: boolean) => {
        if (open) {
          addonsPanelBottomSheetRef.current?.present();
        } else {
          addonsPanelBottomSheetRef.current?.dismiss();
        }
      },
    }));

    const { height } = useWindowDimensions();

    const adjustedBottomSheetSize = useAnimatedStyle(() => {
      const extraPadding = Platform.OS === 'android' ? 32 : 16 + insets.bottom;
      return {
        maxHeight: height - animatedPosition.value - extraPadding,
      };
    }, [animatedPosition, height, insets.bottom]);

    const backgroundStyle = useStyle(() => {
      return {
        borderRadius: 0,
        borderTopColor: theme.appBorderColor,
        borderTopWidth: 1,
        backgroundColor: theme.background.content,
      };
    });

    const handleIndicatorStyle = useStyle(() => {
      return {
        backgroundColor: theme.textMutedColor,
      };
    });

    return (
      <BottomSheetModal
        ref={addonsPanelBottomSheetRef}
        index={1}
        animateOnMount={!reducedMotion}
        snapPoints={['25%', '50%', '75%']}
        style={bottomSheetStyle}
        animatedPosition={animatedPosition}
        backgroundStyle={backgroundStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        keyboardBehavior="extend"
        // keyboardBlurBehavior="restore"
        enableDismissOnClose
        enableHandlePanningGesture={true}
        // enableContentPanningGesture={true}
        stackBehavior="replace"
        enableDynamicSizing={false}
      >
        <Animated.View style={[contentStyle, adjustedBottomSheetSize]}>
          <AddonsTabs
            onClose={() => {
              addonsPanelBottomSheetRef.current?.dismiss();
            }}
            storyId={storyId}
          />
        </Animated.View>
      </BottomSheetModal>
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

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };

export const AddonsTabs = ({ onClose, storyId }: { onClose?: () => void; storyId?: string }) => {
  const panels = addons.getElements(Addon_TypesEnum.PANEL);

  const [addonSelected, setAddonSelected] = useState(Object.keys(panels)[0]);

  const insets = useSafeAreaInsets();

  const scrollContentContainerStyle = useStyle(() => {
    return {
      paddingBottom: insets.bottom + 16,
    };
  });

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
