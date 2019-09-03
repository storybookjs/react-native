import React from 'react';

import { styled } from '@storybook/theming';
import { ScrollArea } from '@storybook/components';
import { State } from '@storybook/api';

import SidebarHeading, { SidebarHeadingProps } from './SidebarHeading';
import SidebarStories from './SidebarStories';

const Heading = styled(SidebarHeading)<SidebarHeadingProps>({
  padding: '20px 20px 12px',
});

const Stories = styled(({ className, ...rest }) => (
  <SidebarStories className={className} {...rest} />
))(({ loading }) => (loading ? { marginTop: 8 } : {}));

const Container = styled.nav({
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
});

const CustomScrollArea = styled(ScrollArea)({
  '.simplebar-track.simplebar-vertical': {
    right: '4px',
  },
});

export interface SidebarProps {
  stories: State['StoriesHash'];
  menu: any[];
  storyId?: string;
  menuHighlighted?: boolean;
  loading?: boolean;
}

const Sidebar = ({
  storyId,
  stories,
  menu,
  menuHighlighted = false,
  loading = false,
}: SidebarProps) => (
  <Container className="container sidebar-container">
    <CustomScrollArea vertical>
      <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />
      <Stories stories={stories} storyId={storyId} loading={loading} />
    </CustomScrollArea>
  </Container>
);

export default Sidebar;
