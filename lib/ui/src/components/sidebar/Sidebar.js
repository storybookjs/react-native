import React from 'react';
import PropTypes from 'prop-types';
import { Spaced } from '@storybook/components';
import { styled } from '@storybook/theming';

import NotificationList, { NotificationListSpacer } from './NotificationList';
import SidebarHeading from './SidebarHeading';

import StoriesExplorer from './StoriesExplorer';

const Container = styled.nav(({ theme }) => ({
  background: theme.asideFill,
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
}));

const Inner = styled.div({
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: 20,
  overflow: 'auto',
  minHeight: '100%',
  boxSizing: 'border-box',
});

const Foot = styled.div({});

export const Notifications = styled.div({
  position: 'absolute',
  display: 'block',
  bottom: 0,
  margin: 0,
  padding: 0,
  width: '100%',
  zIndex: 2,
});

const Sidebar = ({ storyId, notifications = [], stories, menu, menuHighlighted }) => (
  <Container>
    <Inner>
      <Spaced row={2}>
        <SidebarHeading menuHighlighted={menuHighlighted} menu={menu} />
        <StoriesExplorer stories={stories} storyId={storyId} />
      </Spaced>
      <Foot>
        <NotificationListSpacer notifications={notifications} />
      </Foot>
    </Inner>
    <Notifications>
      <NotificationList notifications={notifications} />
    </Notifications>
  </Container>
);

Sidebar.propTypes = {
  stories: PropTypes.shape({}).isRequired,
  storyId: PropTypes.string,
  notifications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  menu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  menuHighlighted: PropTypes.bool,
};
Sidebar.defaultProps = {
  storyId: undefined,
  menuHighlighted: false,
};
Sidebar.displayName = 'Sidebar';

export default Sidebar;
