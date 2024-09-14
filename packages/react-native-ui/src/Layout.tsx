import { SET_CURRENT_STORY } from '@storybook/core/core-events';
import { addons } from '@storybook/core/manager-api';
import { styled, useTheme } from '@storybook/react-native-theming';
import { type API_IndexHash, type Args, type StoryContext } from '@storybook/core/types';
import { ReactNode, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
import { Sidebar } from './Sidebar';
import { DEFAULT_REF_ID } from './constants';
import { BottomBarToggleIcon } from './icon/BottomBarToggleIcon';
import { MenuIcon } from './icon/MenuIcon';

import type { ReactRenderer } from '@storybook/react';
import { MobileMenuDrawer, MobileMenuDrawerRef } from './MobileMenuDrawer';
import { MobileAddonsPanel, MobileAddonsPanelRef } from './MobileAddonsPanel';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const addonPanelRef = useRef<MobileAddonsPanelRef>(null);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.background.content }}>
      <View style={{ flex: 1 }}>{children}</View>
      <MobileMenuDrawer ref={mobileMenuDrawerRef} onStateChange={setDrawerOpen}>
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
      <MobileAddonsPanel ref={addonPanelRef} storyId={story?.id} onStateChange={setMenuOpen} />
      {(Platform.OS !== 'android' || (!menuOpen && !drawerOpen)) && (
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
      )}
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
  zIndex: 10,
  background: theme.barBg,
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
