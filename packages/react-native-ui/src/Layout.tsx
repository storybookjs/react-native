import { Sidebar } from './Sidebar';
import { addons /* useStorybookApi, useStorybookState */ } from '@storybook/manager-api';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import type { API_IndexHash, Args, StoryContext } from '@storybook/types';
import { DEFAULT_REF_ID } from './constants';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { ReactNode, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
// import { Button } from './Button';
import { IconButton } from './IconButton';
import { MenuIcon } from './icon/MenuIcon';
import { styled, useTheme } from '@storybook/react-native-theming';
import { BottomBarToggleIcon } from './icon/BottomBarToggleIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReactRenderer } from '@storybook/react';
import { Button as Button2 } from './Button';
import { CloseIcon } from './icon/CloseIcon';

const BottomSheetBackdropComponent = (backdropComponentProps: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...backdropComponentProps}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    pressBehavior={'close'}
    style={[backdropComponentProps.style, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
  />
);

/**
 * walks the tree from the current story to combine story+component+folder names into a single string
 */
// const useFullStoryName = () => {
//   const { index } = useStorybookState();
//   const currentStory = useStorybookApi()?.getCurrentStoryData?.();

//   if (!currentStory) return '';

//   let fullStoryName = currentStory.renderLabel?.(currentStory) || currentStory.name;
//   let node = index[currentStory.id];

//   while ('parent' in node && node.parent && index[node.parent] && fullStoryName.length < 24) {
//     node = index[node.parent];
//     const parentName = node.renderLabel?.(node) || node.name;
//     fullStoryName = `${parentName}/${fullStoryName}`;
//   }
//   return fullStoryName;
// };

export interface MobileMenuDrawerRef {
  // present: () => void;
  // dismiss: () => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}
const MobileMenuDrawer = forwardRef<MobileMenuDrawerRef, { children: ReactNode | ReactNode[] }>(
  ({ children }, ref) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const reducedMotion = useReducedMotion();

    const menuBottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      isMobileMenuOpen,
      setMobileMenuOpen: (open: boolean) => {
        if (open) {
          setMobileMenuOpen(true);
          menuBottomSheetRef.current?.present();
        } else {
          setMobileMenuOpen(false);
          menuBottomSheetRef.current?.dismiss();
        }
      },
    }));

    return (
      <BottomSheetModal
        ref={menuBottomSheetRef}
        index={1}
        animateOnMount={!reducedMotion}
        onDismiss={() => {
          setMobileMenuOpen(false);
        }}
        snapPoints={['50%', '75%']}
        enableDismissOnClose
        enableHandlePanningGesture
        enableContentPanningGesture
        // enablePanDownToClose={false}
        stackBehavior="replace"
        backdropComponent={BottomSheetBackdropComponent}
      >
        <BottomSheetScrollView>{children}</BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

export interface MobileAddonsPanelRef {
  // present: () => void;
  // dismiss: () => void;
  isAddonsPanelOpen: boolean;
  setAddonsPanelOpen: (isOpen: boolean) => void;
}

const MobileAddonsPanel = forwardRef<MobileAddonsPanelRef, { children: ReactNode | ReactNode[] }>(
  ({ children }, ref) => {
    const [isAddonsPanelOpen, setAddonsPanelOpen] = useState(false);
    const reducedMotion = useReducedMotion();

    const addonsPanelBottomSheetRef = useRef<BottomSheetModal>(null);

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
        style={{ borderTopColor: 'lightgrey', borderTopWidth: 1, paddingTop: 8 }}
        handleComponent={null}
        enableDismissOnClose
        enableHandlePanningGesture
        enableContentPanningGesture
        // enablePanDownToClose={false}
        stackBehavior="replace"
        // backdropComponent={BottomSheetBackdropComponent}
      >
        <View>
          <View style={{ flexDirection: 'row' }}>
            <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 8, columnGap: 8 }}>
              <Button2 size="medium" variant="outline" text="bla" />
              <Button2 size="medium" variant="outline" text="bla2" />
              <Button2 size="medium" variant="outline" text="bla2" />
            </ScrollView>
            <IconButton
              Icon={CloseIcon}
              onPress={() => {
                setAddonsPanelOpen(false);
                addonsPanelBottomSheetRef.current?.dismiss();
              }}
            />
          </View>
          <BottomSheetScrollView>{children}</BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    );
  }
);

export const Layout = ({
  storyHash,
  story,
  children,
}: {
  storyHash: API_IndexHash | undefined;
  story?: StoryContext<ReactRenderer, Args>;
  children: ReactNode | ReactNode[];
}) => {
  const theme = useTheme();
  const mobileMenuDrawerRef = useRef<MobileMenuDrawerRef>(null);
  const addonPanelRef = useRef<MobileAddonsPanelRef>(null);
  // const fullStoryName = useFullStoryName();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <View style={{ flex: 1 }}>{children}</View>
      <MobileMenuDrawer ref={mobileMenuDrawerRef}>
        <Sidebar
          extra={[]}
          previewInitialized
          indexError={undefined}
          refs={{}}
          setSelection={({ storyId: newStoryId }) => {
            const channel = addons.getChannel();

            channel.emit(SET_CURRENT_STORY, { storyId: newStoryId });
          }}
          status={{}}
          index={storyHash}
          storyId={story?.id}
          refId={DEFAULT_REF_ID}
        />
      </MobileMenuDrawer>
      <MobileAddonsPanel ref={addonPanelRef}>
        <Text>Test</Text>
      </MobileAddonsPanel>
      <Container style={{ marginBottom: insets.bottom }}>
        <Nav>
          <Button
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={() => mobileMenuDrawerRef.current.setMobileMenuOpen(true)}
          >
            <MenuIcon color={theme.color.mediumdark} />
            <Text>
              {story.title}/{story.name}
            </Text>
          </Button>
          {/* {showPanel && ( */}
          <IconButton
            onPress={() => addonPanelRef.current.setAddonsPanelOpen(true)}
            // title="Open addon panel"
            Icon={BottomBarToggleIcon}
          />

          {/* )} */}
        </Nav>
      </Container>
    </View>
  );
};

const Nav = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: 40,
  paddingHorizontal: 12,
});

const Container = styled.View(({ theme }) => ({
  // position: 'absolute',
  // bottom: 0,
  // left: 0,
  alignSelf: 'flex-end',
  width: '100%',
  zIndex: 10,
  background: theme.barBg,
  // borderTop: `1px solid ${theme.appBorderColor}`,
  borderTopColor: theme.appBorderColor,
  borderTopWidth: 1,
}));

const Button = styled.TouchableOpacity(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  // paddingVertical: 10,
  gap: 10,
  color: theme.color.mediumdark,
  fontSize: theme.typography.size?.s2 - 1,
  paddingHorizontal: 7,
  fontWeight: theme.typography.weight.bold,
}));
