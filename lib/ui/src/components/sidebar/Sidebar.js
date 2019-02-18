import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import NotificationList, { NotificationListSpacer } from './NotificationList';
import SidebarHeading from './SidebarHeading';
import SidebarStories from './SidebarStories';

const Heading = styled(SidebarHeading)({
  padding: '20px 20px 12px',
});

const Stories = styled(SidebarStories)(({ loading }) => (loading ? { marginTop: 8 } : {}));

const Container = styled.nav({
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
});

const Foot = styled.div({});

export const Notifications = styled.div({
  position: 'fixed',
  display: 'block',
  bottom: 20,
  left: 20,
  margin: 0,
  padding: 0,
  width: '20%',
  minWidth: 200,
  maxWidth: 280,
  zIndex: 2,
});

const Sidebar = ({ storyId, notifications = [], stories, menu, menuHighlighted, loading }) => (
  <Container className="container">
    <Heading menuHighlighted={menuHighlighted} menu={menu} />
    <Stories stories={stories} storyId={storyId} loading={loading} />

    <Foot>
      <NotificationListSpacer notifications={notifications} />
    </Foot>

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
  loading: PropTypes.bool,
};
Sidebar.defaultProps = {
  storyId: undefined,
  menuHighlighted: false,
  loading: false,
};
Sidebar.displayName = 'Sidebar';

export default Sidebar;
