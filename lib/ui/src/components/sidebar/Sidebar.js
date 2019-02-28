import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import { ScrollArea } from '@storybook/components';

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
});

const CustomScrollArea = styled(ScrollArea)({
  '.simplebar-track.simplebar-vertical': {
    right: '4px',
  },
});

const Sidebar = ({ storyId, stories, menu, menuHighlighted, loading }) => (
  <Container className="container">
    <CustomScrollArea vertical>
      <Heading menuHighlighted={menuHighlighted} menu={menu} />
      <Stories stories={stories} storyId={storyId} loading={loading} />
    </CustomScrollArea>
  </Container>
);

Sidebar.propTypes = {
  stories: PropTypes.shape({}).isRequired,
  storyId: PropTypes.string,
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
