import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost } from '@gorhom/portal';
import type { ReactRenderer } from '@storybook/react';
import { styled, ThemeProvider, useTheme } from '@storybook/react-native-theming';
import {
  IconButton,
  LayoutProvider,
  StorageProvider,
  useLayout,
  useStoreBooleanState,
  useStyle,
  type SBUI,
} from '@storybook/react-native-ui-common';
import { ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SET_CURRENT_STORY } from 'storybook/internal/core-events';
import type { Args, StoryContext } from 'storybook/internal/csf';
import type { API_IndexHash } from 'storybook/internal/types';
import { addons } from 'storybook/manager-api';
import { DEFAULT_REF_ID } from './constants';
import { BottomBarToggleIcon } from './icon/BottomBarToggleIcon';
import { CloseFullscreenIcon } from './icon/CloseFullscreenIcon';
import { FullscreenIcon } from './icon/FullscreenIcon';
import { MenuIcon } from './icon/MenuIcon';
import { AddonsTabs, MobileAddonsPanel, MobileAddonsPanelRef } from './MobileAddonsPanel';
import { MobileMenuDrawer, MobileMenuDrawerRef } from './MobileMenuDrawer';
import { SelectedNodeProvider } from './SelectedNodeProvider';
import { Sidebar } from './Sidebar';
import { StorybookLogo } from './StorybookLogo';

const desktopLogoContainer = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: 10,
  paddingLeft: 16,
  paddingBottom: 4,
  paddingRight: 10,
  justifyContent: 'space-between',
} satisfies ViewStyle;

const contentContainerStyle = { flex: 1, overflow: 'hidden' } satisfies ViewStyle;

const mobileContentStyle = { flex: 1, overflow: 'hidden' } satisfies ViewStyle;

const placeholderObject = {};

const iconFloatRightStyle = { marginLeft: 'auto' } satisfies ViewStyle;

const navButtonStyle = { flexShrink: 1 } satisfies ViewStyle;

const navButtonHitSlop = { bottom: 10, left: 10, right: 10, top: 10 };

const mobileMenuDrawerContentStyle = {
  paddingLeft: 16,
  paddingTop: 4,
  paddingBottom: 4,
} satisfies ViewStyle;

const flex1 = { flex: 1 } satisfies ViewStyle;

export const FullUI: SBUI = ({ storage, theme, storyHash, story, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={flex1}>
          <BottomSheetModalProvider>
            <StorageProvider storage={storage}>
              <LayoutProvider>
                <Layout storyHash={storyHash} story={story}>
                  {children}
                </Layout>
                <PortalHost name="storybook-lite-ui-root" />
              </LayoutProvider>
            </StorageProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

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
  const insets = useSafeAreaInsets();
  const { isDesktop } = useLayout();

  const [desktopSidebarOpen, setDesktopSidebarOpen] = useStoreBooleanState(
    'desktopSidebarState',
    true
  );

  const [desktopAddonsPanelOpen, setDesktopAddonsPanelOpen] = useStoreBooleanState(
    'desktopPanelState',
    true
  );

  const [uiHidden, setUiHidden] = useState(false);

  useLayoutEffect(() => {
    setUiHidden(story?.parameters?.storybookUIVisibility === 'hidden');
  }, [story?.parameters?.storybookUIVisibility]);

  const desktopSidebarStyle = useStyle(
    () => ({
      width: desktopSidebarOpen ? 240 : undefined,
      padding: desktopSidebarOpen ? 0 : 10,
      borderColor: theme.appBorderColor,
      borderRightWidth: 1,
    }),
    [desktopSidebarOpen, theme.appBorderColor]
  );

  const desktopScrollViewContentContainerStyle = useStyle(
    () => ({
      paddingBottom: insets.bottom,
    }),
    [insets.bottom]
  );

  const desktopAddonsPanelStyle = useStyle(
    () => ({
      height: desktopAddonsPanelOpen ? 300 : undefined,
      borderTopWidth: 1,
      borderColor: theme.appBorderColor,
      paddingTop: desktopAddonsPanelOpen ? 4 : 0,
      padding: desktopAddonsPanelOpen ? 0 : 10,
    }),
    [desktopAddonsPanelOpen, theme.appBorderColor]
  );

  const containerStyle = useStyle(() => {
    if (isDesktop) {
      return {
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: theme.background.content,
        flexDirection: 'row',
      };
    }

    return {
      flex: 1,
      paddingTop: story?.parameters?.noSafeArea ? 0 : insets.top,
      backgroundColor: theme.background.content,
    };
  }, [theme.background.content, insets.top, story?.parameters?.noSafeArea, isDesktop]);

  const fullScreenButtonStyle = useStyle(
    () => ({
      position: 'absolute',
      bottom: uiHidden ? 56 + insets.bottom : 16,
      right: 16,
      backgroundColor: theme.background.content,
      padding: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.appBorderColor,
    }),
    [uiHidden, insets.bottom, theme.background.content, theme.appBorderColor]
  );

  const menuContainerStyle = useStyle(
    () => ({
      marginBottom: insets.bottom,
    }),
    [insets.bottom]
  );

  const navButtonTextStyle = useStyle(
    () => ({
      flexShrink: 1,
      color: theme.barTextColor,
    }),
    [theme.barTextColor]
  );

  const openMobileMenu = useCallback(() => {
    mobileMenuDrawerRef.current.setMobileMenuOpen(true);
  }, [mobileMenuDrawerRef]);

  const setSelection = useCallback(({ storyId: newStoryId }: { storyId: string }) => {
    const channel = addons.getChannel();

    channel.emit(SET_CURRENT_STORY, { storyId: newStoryId });
  }, []);

  return (
    <View style={containerStyle}>
      {isDesktop ? (
        <View style={desktopSidebarStyle}>
          {desktopSidebarOpen ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={desktopScrollViewContentContainerStyle}
            >
              <View style={desktopLogoContainer}>
                <StorybookLogo theme={theme} />

                <IconButton onPress={() => setDesktopSidebarOpen(false)} Icon={MenuIcon} />
              </View>

              <Sidebar
                previewInitialized
                indexError={undefined}
                refs={placeholderObject}
                setSelection={setSelection}
                status={placeholderObject}
                index={storyHash}
                storyId={story?.id}
                refId={DEFAULT_REF_ID}
              />
            </ScrollView>
          ) : (
            <IconButton onPress={() => setDesktopSidebarOpen(true)} Icon={MenuIcon} />
          )}
        </View>
      ) : null}

      <View style={mobileContentStyle}>
        <View style={contentContainerStyle}>{children}</View>

        {story?.parameters?.hideFullScreenButton || isDesktop ? null : (
          <TouchableOpacity
            style={fullScreenButtonStyle}
            onPress={() => setUiHidden((prev) => !prev)}
          >
            {uiHidden ? (
              <CloseFullscreenIcon color={theme.color.mediumdark} />
            ) : (
              <FullscreenIcon color={theme.color.mediumdark} />
            )}
          </TouchableOpacity>
        )}

        {isDesktop ? (
          <View style={desktopAddonsPanelStyle}>
            {desktopAddonsPanelOpen ? (
              <AddonsTabs storyId={story?.id} onClose={() => setDesktopAddonsPanelOpen(false)} />
            ) : (
              <IconButton
                style={iconFloatRightStyle}
                onPress={() => setDesktopAddonsPanelOpen(true)}
                Icon={BottomBarToggleIcon}
              />
            )}
          </View>
        ) : null}
      </View>

      {!uiHidden && !isDesktop ? (
        <Container style={menuContainerStyle}>
          <Nav>
            <Button
              testID="mobile-menu-button"
              style={navButtonStyle}
              hitSlop={navButtonHitSlop}
              onPress={openMobileMenu}
            >
              <MenuIcon color={theme.color.mediumdark} />
              <Text style={navButtonTextStyle} numberOfLines={1}>
                {story?.title}/{story?.name}
              </Text>
            </Button>

            <IconButton
              testID="mobile-addons-button"
              onPress={() => addonPanelRef.current.setAddonsPanelOpen(true)}
              Icon={BottomBarToggleIcon}
            />
          </Nav>
        </Container>
      ) : null}

      {isDesktop ? null : (
        <SelectedNodeProvider>
          <MobileMenuDrawer ref={mobileMenuDrawerRef}>
            <View style={mobileMenuDrawerContentStyle}>
              <StorybookLogo theme={theme} />
            </View>

            <Sidebar
              previewInitialized
              indexError={undefined}
              refs={placeholderObject}
              setSelection={setSelection}
              status={placeholderObject}
              index={storyHash}
              storyId={story?.id}
              refId={DEFAULT_REF_ID}
            />
          </MobileMenuDrawer>
        </SelectedNodeProvider>
      )}

      {isDesktop ? null : <MobileAddonsPanel ref={addonPanelRef} storyId={story?.id} />}
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
  paddingHorizontal: 6,
});

const Container = styled.View(({ theme }) => ({
  alignSelf: 'flex-end',
  width: '100%',
  backgroundColor: theme.barBg,
  borderTopColor: theme.appBorderColor,
  borderTopWidth: 1,
}));

const Button = styled.TouchableOpacity(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  color: theme.color.mediumdark,
  fontSize: theme.typography.size?.s2 - 1,
  paddingHorizontal: 7,
  fontWeight: theme.typography.weight.bold,
}));
