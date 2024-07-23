import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { addons } from '@storybook/core/manager-api';
import { styled } from '@storybook/react-native-theming';
import { Addon_TypesEnum } from '@storybook/core/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from './IconButton';
import { CloseIcon } from './icon/CloseIcon';

export interface MobileAddonsPanelRef {
  setAddonsPanelOpen: (isOpen: boolean) => void;
}

export const MobileAddonsPanel = forwardRef<
  MobileAddonsPanelRef,
  { storyId?: string; onStateChange: (open: boolean) => void }
>(({ storyId, onStateChange }, ref) => {
  const reducedMotion = useReducedMotion();

  const addonsPanelBottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  const panels = addons.getElements(Addon_TypesEnum.PANEL);
  const [addonSelected, setAddonSelected] = useState(Object.keys(panels)[0]);
  const animatedPosition = useSharedValue(0);

  // bringing in animated keyboard disables android resizing
  // TODO replicate functionality without this
  useAnimatedKeyboard();

  useImperativeHandle(ref, () => ({
    setAddonsPanelOpen: (open: boolean) => {
      if (open) {
        onStateChange(true);
        addonsPanelBottomSheetRef.current?.present();
      } else {
        onStateChange(false);
        addonsPanelBottomSheetRef.current?.dismiss();
      }
    },
  }));

  const { height } = useWindowDimensions();

  const adjustedBottomSheetSize = useAnimatedStyle(() => {
    return {
      maxHeight: height - animatedPosition.value - insets.bottom,
    };
  }, [animatedPosition.value, height, insets.bottom]);

  return (
    <BottomSheetModal
      ref={addonsPanelBottomSheetRef}
      index={1}
      animateOnMount={!reducedMotion}
      onDismiss={() => {
        onStateChange(false);
      }}
      snapPoints={['25%', '50%', '75%']}
      style={{
        paddingTop: 8,
      }}
      animatedPosition={animatedPosition}
      containerStyle={{}}
      backgroundStyle={{
        borderRadius: 0,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
      }}
      keyboardBehavior="extend"
      // keyboardBlurBehavior="restore"
      enableDismissOnClose
      enableHandlePanningGesture={true}
      // enableContentPanningGesture={true}
      stackBehavior="replace"
    >
      <Animated.View style={[{ flex: 1 }, adjustedBottomSheetSize]}>
        <View style={{ flexDirection: 'row' }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
              justifyContent: 'center',
            }}
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
            style={{
              marginRight: 4,
              marginBottom: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            Icon={CloseIcon}
            onPress={() => {
              onStateChange(false);
              addonsPanelBottomSheetRef.current?.dismiss();
            }}
          />
        </View>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 16,
            marginTop: 10,
            paddingHorizontal: 16,
          }}
        >
          {(() => {
            if (!storyId) {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text>No Story Selected</Text>
                </View>
              );
            }

            if (Object.keys(panels).length === 0) {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text>No addons loaded.</Text>
                </View>
              );
            }

            return panels[addonSelected].render({ active: true });
          })()}
        </ScrollView>
      </Animated.View>
    </BottomSheetModal>
  );
});

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