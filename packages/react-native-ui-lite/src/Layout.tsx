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
  useStoreNumberState,
  useStyle,
} from '@storybook/react-native-ui-common';
import { ReactElement, ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View, ViewStyle } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SET_CURRENT_STORY } from 'storybook/internal/core-events';
import type { Args, StoryContext } from 'storybook/internal/csf';
import { type API_IndexHash } from 'storybook/internal/types';
import { addons } from 'storybook/manager-api';
import { AddonsTabs, MobileAddonsPanel, MobileAddonsPanelRef } from './MobileAddonsPanel';
import { MobileMenuDrawer, MobileMenuDrawerRef } from './MobileMenuDrawer';
import { ResizeHandle } from './ResizeHandle';
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

const navButtonStyle = { flex: 1 } satisfies ViewStyle;

const navButtonHitSlop = { bottom: 10, left: 10, top: 10 };

const addonButtonHitSlop = { bottom: 10, left: 10, right: 10, top: 10 };

const mobileMenuDrawerContentStyle = {
  paddingLeft: 16,
  paddingBottom: 4,
} satisfies ViewStyle;

const flexStyle = { flex: 1 } satisfies ViewStyle;

export const LiteUI: SBUI = ({
  storage,
  theme,
  storyHash,
  story,
  storyBackgroundColor,
  children,
}): ReactElement => (
  <SafeAreaProvider style={flexStyle}>
    <SelectedNodeProvider>
      <ThemeProvider theme={theme}>
        <StorageProvider storage={storage}>
          <LayoutProvider>
            <PortalProvider shouldAddRootHost={false}>
              <Layout
                storyHash={storyHash}
                story={story}
                storyBackgroundColor={storyBackgroundColor}
              >
                {children}
              </Layout>
              <PortalHost name="storybook-lite-ui-root" />
            </PortalProvider>
          </LayoutProvider>
        </StorageProvider>
      </ThemeProvider>
    </SelectedNodeProvider>
  </SafeAreaProvider>
);

export const Layout = ({
  storyHash,
  story,
  storyBackgroundColor,
  children,
}: {
  storyHash: API_IndexHash | undefined;
  story?: StoryContext<ReactRenderer, Args>;
  storyBackgroundColor?: string;
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

  const [sidebarWidth, setSidebarWidth] = useStoreNumberState('desktopSidebarWidth', 240);
  const [addonsPanelHeight, setAddonsPanelHeight] = useStoreNumberState(
    'desktopAddonsPanelHeight',
    300
  );

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const handleSidebarResize = useCallback(
    (delta: number) => {
      setSidebarWidth((prev) => Math.min(Math.max(prev + delta, 180), windowWidth * 0.5));
    },
    [setSidebarWidth, windowWidth]
  );

  const handleAddonsPanelResize = useCallback(
    (delta: number) => {
      // Negative delta = dragging up = panel gets larger
      setAddonsPanelHeight((prev) => Math.min(Math.max(prev - delta, 100), windowHeight * 0.6));
    },
    [setAddonsPanelHeight, windowHeight]
  );

  const [isResizing, setIsResizing] = useState(false);

  const onResizeStart = useCallback(() => setIsResizing(true), []);
  const onResizeEnd = useCallback(() => setIsResizing(false), []);

  const [uiHidden, setUiHidden] = useState(false);

  useLayoutEffect(() => {
    setUiHidden(story?.parameters?.storybookUIVisibility === 'hidden');
  }, [story?.parameters?.storybookUIVisibility]);

  const desktopSidebarStyle = useStyle(
    () => ({
      width: desktopSidebarOpen ? sidebarWidth : undefined,
      padding: desktopSidebarOpen ? 0 : 10,
      borderColor: theme.appBorderColor,
      borderRightWidth: desktopSidebarOpen ? 0 : 1,
    }),
    [desktopSidebarOpen, sidebarWidth, theme.appBorderColor]
  );

  const desktopAddonsPanelStyle = useStyle(
    () => ({
      height: desktopAddonsPanelOpen ? addonsPanelHeight : undefined,
      borderTopWidth: desktopAddonsPanelOpen ? 0 : 1,
      borderColor: theme.appBorderColor,
      paddingTop: desktopAddonsPanelOpen ? 4 : 0,
      padding: desktopAddonsPanelOpen ? 0 : 10,
    }),
    [desktopAddonsPanelOpen, addonsPanelHeight, theme.appBorderColor]
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
      backgroundColor: storyBackgroundColor || theme.background.content,
      paddingTop: story?.parameters?.noSafeArea ? 0 : insets.top,
    };
  }, [storyBackgroundColor, theme.background.content, story?.parameters?.noSafeArea, isDesktop]);

  const storyContentStyle = useStyle(
    () => ({
      flex: 1,
      overflow: 'hidden' as const,
      backgroundColor: storyBackgroundColor || theme.background.content,
    }),
    [storyBackgroundColor, theme.background.content]
  );

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const setSelection = useCallback(({ storyId: newStoryId }: { storyId: string }) => {
    const channel = addons.getChannel();

    channel.emit(SET_CURRENT_STORY, { storyId: newStoryId });
  }, []);

  return (
    <View
      style={containerStyle}
      accessibilityElementsHidden={isDrawerOpen}
      importantForAccessibility={isDrawerOpen ? 'no-hide-descendants' : 'auto'}
    >
      {isDesktop ? (
        <>
          <View style={desktopSidebarStyle} pointerEvents={isResizing ? 'none' : 'auto'}>
            {desktopSidebarOpen ? (
              <>
                <View style={desktopLogoContainer}>
                  <StorybookLogo theme={theme} />

                  <IconButton
                    onPress={() => setDesktopSidebarOpen(false)}
                    Icon={MenuIcon}
                    accessibilityLabel="Close sidebar"
                  />
                </View>

                <View style={flexStyle}>
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
                </View>
              </>
            ) : (
              <IconButton
                onPress={() => setDesktopSidebarOpen(true)}
                Icon={MenuIcon}
                accessibilityLabel="Open sidebar"
              />
            )}
          </View>
          {desktopSidebarOpen ? (
            <ResizeHandle
              direction="horizontal"
              onResize={handleSidebarResize}
              onResizeStart={onResizeStart}
              onResizeEnd={onResizeEnd}
            />
          ) : null}
        </>
      ) : null}

      <View style={mobileContentStyle}>
        <View
          style={isDesktop ? storyContentStyle : contentContainerStyle}
          pointerEvents={isResizing ? 'none' : 'auto'}
        >
          {children}
        </View>

        {story?.parameters?.hideFullScreenButton || isDesktop ? null : (
          <TouchableOpacity
            style={fullScreenButtonStyle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => setUiHidden((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={uiHidden ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {uiHidden ? (
              <CloseFullscreenIcon color={theme.color.mediumdark} />
            ) : (
              <FullscreenIcon color={theme.color.mediumdark} />
            )}
          </TouchableOpacity>
        )}

        {isDesktop ? (
          <>
            {desktopAddonsPanelOpen ? (
              <ResizeHandle
                direction="vertical"
                onResize={handleAddonsPanelResize}
                onResizeStart={onResizeStart}
                onResizeEnd={onResizeEnd}
              />
            ) : null}
            <View style={desktopAddonsPanelStyle} pointerEvents={isResizing ? 'none' : 'auto'}>
              {desktopAddonsPanelOpen ? (
                <AddonsTabs storyId={story?.id} onClose={() => setDesktopAddonsPanelOpen(false)} />
              ) : (
                <IconButton
                  style={iconFloatRightStyle}
                  onPress={() => setDesktopAddonsPanelOpen(true)}
                  Icon={BottomBarToggleIcon}
                  accessibilityLabel="Open addons panel"
                />
              )}
            </View>
          </>
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
              accessibilityRole="button"
              accessibilityLabel="Open story list"
            >
              <MenuIcon color={theme.color.mediumdark} />
              <Text style={navButtonTextStyle} numberOfLines={1}>
                {story?.title}/{story?.name}
              </Text>
            </Button>

            <IconButton
              testID="mobile-addons-button"
              hitSlop={addonButtonHitSlop}
              onPress={() => addonPanelRef.current.setAddonsPanelOpen(true)}
              Icon={BottomBarToggleIcon}
              accessibilityLabel="Open addons panel"
            />
          </Nav>
        </Container>
      ) : null}

      {isDesktop ? null : (
        <MobileMenuDrawer ref={mobileMenuDrawerRef} onVisibilityChange={setIsDrawerOpen}>
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
