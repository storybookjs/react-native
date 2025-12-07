import { PortalHost, PortalProvider } from '@gorhom/portal';
import type { ReactRenderer } from '@storybook/react';
import { styled, ThemeProvider, useTheme } from '@storybook/react-native-theming';
import {
  IconButton,
  LayoutProvider,
  SBUI,
  StorageProvider,
  useLayout,
  useStoreBooleanState,
  useStyle,
} from '@storybook/react-native-ui-common';
import { ReactElement, ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SET_CURRENT_STORY } from 'storybook/internal/core-events';
import type { Args, StoryContext } from 'storybook/internal/csf';
import { type API_IndexHash } from 'storybook/internal/types';
import { addons } from 'storybook/manager-api';
import { AddonsTabs, MobileAddonsPanel, MobileAddonsPanelRef } from './MobileAddonsPanel';
import { MobileMenuDrawer, MobileMenuDrawerRef } from './MobileMenuDrawer';
import { SelectedNodeProvider } from './SelectedNodeProvider';
import { Sidebar } from './Sidebar';
import { StorybookLogo } from './StorybookLogo';
import { DEFAULT_REF_ID } from './constants';
import {
  BottomBarToggleIcon,
  CloseFullscreenIcon,
  FullscreenIcon,
  MenuIcon,
} from './icon/iconDataUris';

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

export const LiteUI: SBUI = ({ storage, theme, storyHash, story, children }): ReactElement => (
  <SafeAreaProvider style={{ flex: 1 }}>
    <ThemeProvider theme={theme}>
      <StorageProvider storage={storage}>
        <LayoutProvider>
          <PortalProvider shouldAddRootHost={false}>
            <Layout storyHash={storyHash} story={story}>
              {children}
            </Layout>
            <PortalHost name="storybook-lite-ui-root" />
          </PortalProvider>
        </LayoutProvider>
      </StorageProvider>
    </ThemeProvider>
  </SafeAreaProvider>
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

  const { isDesktop } = useLayout();

  const insets = useSafeAreaInsets();

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
        backgroundColor: theme.background.content,
        flexDirection: 'row',
      };
    }

    return {
      flex: 1,
      backgroundColor: theme.background.content,
      paddingTop: story?.parameters?.noSafeArea ? 0 : insets.top,
    };
  }, [theme.background.content, story?.parameters?.noSafeArea, isDesktop]);

  const navContainerStyle = useStyle(
    () => ({
      paddingBottom: insets.bottom,
    }),
    [insets.bottom]
  );

  const fullScreenButtonStyle = useStyle(
    () => ({
      position: 'absolute',
      bottom: uiHidden ? insets.bottom + 56 : 16,
      right: 16,
      backgroundColor: theme.background.content,
      padding: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.appBorderColor,
    }),
    [uiHidden, theme.background.content, theme.appBorderColor]
  );

  const navButtonTextStyle = useStyle(
    () => ({
      flexShrink: 1,
      color: theme.barTextColor,
    }),
    [theme.barTextColor]
  );

  const mobileMenuDrawerRef = useRef<MobileMenuDrawerRef>(null);
  const addonPanelRef = useRef<MobileAddonsPanelRef>(null);

  const setSelection = useCallback(({ storyId: newStoryId }: { storyId: string }) => {
    const channel = addons.getChannel();

    channel.emit(SET_CURRENT_STORY, { storyId: newStoryId });
  }, []);

  return (
    <View style={containerStyle}>
      {isDesktop ? (
        <View style={desktopSidebarStyle}>
          {desktopSidebarOpen ? (
            <ScrollView keyboardShouldPersistTaps="handled">
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
        <Container style={navContainerStyle}>
          <Nav>
            <Button
              testID="mobile-menu-button"
              style={navButtonStyle}
              hitSlop={navButtonHitSlop}
              onPress={() => mobileMenuDrawerRef.current?.setMobileMenuOpen(true)}
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
