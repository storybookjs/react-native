import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';
import { Placeholder } from '@storybook/components';
import { Location, Link as RouterLink } from '@storybook/router';
import { TreeState } from './treeview/treeview';

import SidebarItem from './SidebarItem';
import SidebarSearch from './SidebarSearch';
import SidebarSubheading from './SidebarSubheading';

export const Section = styled.section({});

export const List = styled.div();
List.displayName = 'List';

const UnstyledRouterLink = styled(RouterLink)({
  color: 'inherit',
  textDecoration: 'none',
  display: 'block',
});

export const Link = ({ id, prefix, children, ...rest }) => (
  <Location>
    {({ viewMode }) => (
      <UnstyledRouterLink to={`/${viewMode || 'story'}/${id}`} {...rest}>
        {children}
      </UnstyledRouterLink>
    )}
  </Location>
);
Link.displayName = 'Link';
Link.propTypes = {
  id: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const StoriesExplorer = React.memo(({ stories, storyId, loading, ...rest }) => {
  const list = Object.entries(stories);

  if (loading) {
    return (
      <div>
        <SidebarItem loading />
        <SidebarItem loading />
        <SidebarItem loading />
        <SidebarItem loading />
        <SidebarItem loading />
        <SidebarItem loading />
        <SidebarItem loading />
      </div>
    );
  }

  if (list.length < 1) {
    return <Placeholder key="empty">There have no stories been loaded yet</Placeholder>;
  }

  return (
    <TreeState
      key="treestate"
      dataset={stories}
      prefix="explorer"
      selectedId={storyId}
      filter=""
      List={List}
      Head={SidebarItem}
      Link={Link}
      Leaf={p => <SidebarItem isStory {...p} />}
      Title={SidebarSubheading}
      Section={Section}
      Message={Placeholder}
      // eslint-disable-next-line react/jsx-no-duplicate-props
      Filter={SidebarSearch}
      {...rest}
    />
  );
});
StoriesExplorer.propTypes = {
  loading: PropTypes.bool,
  stories: PropTypes.shape({}).isRequired,
  storyId: PropTypes.string,
};
StoriesExplorer.defaultProps = {
  storyId: undefined,
  loading: false,
};

export default StoriesExplorer;
