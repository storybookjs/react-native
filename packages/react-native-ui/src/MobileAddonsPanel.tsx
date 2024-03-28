import { BottomSheetModal, BottomSheetScrollView, TouchableOpacity } from '@gorhom/bottom-sheet';
import { addons } from '@storybook/manager-api';
import { styled } from '@storybook/react-native-theming';
import { Addon_TypesEnum } from '@storybook/types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button as Button2 } from './Button';
import { IconButton } from './IconButton';
import { CloseIcon } from './icon/CloseIcon';

export interface MobileAddonsPanelRef {
  isAddonsPanelOpen: boolean;
  setAddonsPanelOpen: (isOpen: boolean) => void;
}

export const MobileAddonsPanel = forwardRef<MobileAddonsPanelRef, { storyId?: string }>(
  ({ storyId }, ref) => {
    const [isAddonsPanelOpen, setAddonsPanelOpen] = useState(false);
    const reducedMotion = useReducedMotion();

    const addonsPanelBottomSheetRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();

    const panels = addons.getElements(Addon_TypesEnum.PANEL);
    const [addonSelected, setAddonSelected] = useState(Object.keys(panels)[0]);

    useImperativeHandle(ref, () => ({
      isAddonsPanelOpen,
      setAddonsPanelOpen: (open: boolean) => {
        if (open) {
          setAddonsPanelOpen(true);
          addonsPanelBottomSheetRef.current?.present();
        } else {
          setAddonsPanelOpen(false);
          addonsPanelBottomSheetRef.current?.dismiss();
        }
      },
    }));

    return (
      <BottomSheetModal
        ref={addonsPanelBottomSheetRef}
        index={1}
        animateOnMount={!reducedMotion}
        onDismiss={() => {
          setAddonsPanelOpen(false);
        }}
        snapPoints={['25%', '50%']}
        style={{
          paddingTop: 8,
        }}
        containerStyle={{}}
        backgroundStyle={{
          borderRadius: 0,
          borderTopColor: 'lightgrey',
          borderTopWidth: 1,
        }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enableDismissOnClose
        enableHandlePanningGesture={true}
        enableContentPanningGesture={true}
        // enablePanDownToClose={false}
        stackBehavior="replace"
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 8,
                // alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Object.values(panels).map(({ id, title }) => {
                const resolvedTitle = typeof title === 'function' ? title({}) : title;

                return (
                  <Tab
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
                setAddonsPanelOpen(false);
                addonsPanelBottomSheetRef.current?.dismiss();
              }}
            />
          </View>
          <BottomSheetScrollView
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
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    );
  }
);

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
  fontSize: 13,
  lineHeight: 12,
}));
