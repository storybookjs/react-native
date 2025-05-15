import { styled, useTheme } from '@storybook/react-native-theming';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import {
  Modal,
  // Platform,
  // Platform,
  ScrollView,
  StyleProp,
  Text,
  // useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { addons } from 'storybook/internal/manager-api';
import { Addon_TypesEnum } from 'storybook/internal/types';
import { IconButton } from './IconButton';
import { useStyle } from './util/useStyle';
import { CloseIcon } from './icon/iconDataUris';

export interface MobileAddonsPanelRef {
  setAddonsPanelOpen: (isOpen: boolean) => void;
}

const contentStyle = {
  flex: 1,
} satisfies StyleProp<ViewStyle>;

// export const MobileAddonsPanel = forwardRef<MobileAddonsPanelRef, { storyId?: string }>(
//   ({ storyId }, ref) => {
//     const theme = useTheme();
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//     // bringing in animated keyboard disables android resizing
//     // TODO replicate functionality without this

//     useImperativeHandle(ref, () => ({
//       setAddonsPanelOpen: (open: boolean) => {
//         if (open) {
//           setMobileMenuOpen(true);
//         } else {
//           setMobileMenuOpen(false);
//         }
//       },
//     }));

//     // const { height } = useWindowDimensions();

//     // const adjustedBottomSheetSize = useAnimatedStyle(() => {
//     //   const extraPadding = Platform.OS === 'android' ? 32 : 16;
//     //   return {
//     //     maxHeight: height - animatedPosition.value - insets.bottom - extraPadding,
//     //   };
//     // }, [animatedPosition, height, insets.bottom]);

//     const backgroundStyle = useStyle(() => {
//       return {
//         borderRadius: 0,
//         borderTopColor: theme.appBorderColor,
//         borderTopWidth: 1,
//         backgroundColor: theme.background.content,
//       };
//     });

//     // const handleIndicatorStyle = useStyle(() => {
//     //   return {
//     //     backgroundColor: theme.textMutedColor,
//     //   };
//     // });

//     return (
//       <Modal
//         visible={mobileMenuOpen}
//         onRequestClose={() => setMobileMenuOpen(false)}
//         transparent
//         animationType="slide"
//       >
//         <View style={[contentStyle, backgroundStyle]}>
//           <AddonsTabs
//             onClose={() => {
//               setMobileMenuOpen(false);
//             }}
//             storyId={storyId}
//           />
//         </View>
//       </Modal>
//     );
//   }
// );

// MobileAddonsPanel.displayName = 'MobileAddonsPanel';

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
