import { SET_CURRENT_STORY } from '@storybook/core/core-events';
import { addons } from '@storybook/core/manager-api';
import { type API_IndexHash, type Args, type StoryContext } from '@storybook/core/types';
import type { ReactRenderer } from '@storybook/react';
import { styled, useTheme } from '@storybook/react-native-theming';
import { ReactNode, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
import { useLayout } from './LayoutProvider';
import { AddonsTabs, MobileAddonsPanel, MobileAddonsPanelRef } from './MobileAddonsPanel';
import { MobileMenuDrawer, MobileMenuDrawerRef } from './MobileMenuDrawer';
import { Sidebar } from './Sidebar';
import { DEFAULT_REF_ID } from './constants';
import { BottomBarToggleIcon } from './icon/BottomBarToggleIcon';
import { DarkLogo } from './icon/DarkLogo';
import { Logo } from './icon/Logo';
import { MenuIcon } from './icon/MenuIcon';

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

  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const [desktopAddonsPanelOpen, setDesktopAddonsPanelOpen] = useState(true);

  if (isDesktop) {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: theme.background.content,
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            width: desktopSidebarOpen ? 240 : undefined,
            padding: desktopSidebarOpen ? 0 : 10,
            borderColor: theme.appBorderColor,
            borderRightWidth: 1,
          }}
        >
          {desktopSidebarOpen ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: insets.bottom,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 10,
                  paddingLeft: 16,
                  paddingBottom: 4,
                  paddingRight: 10,
                  justifyContent: 'space-between',
                }}
              >
                {theme.base === 'light' ? (
                  <Logo height={25} width={125} />
                ) : (
                  <DarkLogo height={25} width={125} />
                )}

                <IconButton onPress={() => setDesktopSidebarOpen(false)} Icon={MenuIcon} />
              </View>

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
            </ScrollView>
          ) : (
            <IconButton onPress={() => setDesktopSidebarOpen(true)} Icon={MenuIcon} />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, overflow: 'hidden' }}>{children}</View>

          <View
            style={{
              height: desktopAddonsPanelOpen ? 300 : undefined,
              borderTopWidth: 1,
              borderColor: theme.appBorderColor,
              paddingTop: desktopAddonsPanelOpen ? 4 : 0,
              padding: desktopAddonsPanelOpen ? 0 : 10,
            }}
          >
            {desktopAddonsPanelOpen ? (
              <AddonsTabs storyId={story?.id} onClose={() => setDesktopAddonsPanelOpen(false)} />
            ) : (
              <IconButton
                style={{ marginLeft: 'auto' }}
                onPress={() => setDesktopAddonsPanelOpen(true)}
                Icon={BottomBarToggleIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.background.content }}>
      <View style={{ flex: 1, overflow: 'hidden' }}>{children}</View>

      <Container style={{ marginBottom: insets.bottom }}>
        <Nav>
          <Button
            style={{ flexShrink: 1 }}
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            onPress={() => {
              mobileMenuDrawerRef.current.setMobileMenuOpen(true);
            }}
          >
            <MenuIcon color={theme.color.mediumdark} />
            <Text style={{ flexShrink: 1, color: theme.color.defaultText }} numberOfLines={1}>
              {story?.title}/{story?.name}
            </Text>
          </Button>

          <IconButton
            onPress={() => addonPanelRef.current.setAddonsPanelOpen(true)}
            Icon={BottomBarToggleIcon}
          />
        </Nav>
      </Container>

      <MobileMenuDrawer ref={mobileMenuDrawerRef}>
        <View style={{ paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
          {theme.base === 'light' ? (
            <Logo height={25} width={125} />
          ) : (
            <DarkLogo height={25} width={125} />
          )}
        </View>
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

      <MobileAddonsPanel ref={addonPanelRef} storyId={story?.id} />
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
