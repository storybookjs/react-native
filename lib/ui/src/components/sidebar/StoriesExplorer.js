import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';
import { Explorer } from '@storybook/components';
import { Location, Link as RouterLink } from '@storybook/router';

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

const StoriesExplorer = React.memo(props => (
  <Explorer
    {...props}
    List={List}
    Head={SidebarItem}
    Link={Link}
    Leaf={p => <SidebarItem isStory {...p} />}
    Title={SidebarSubheading}
    Section={Section}
    Filter={SidebarSearch}
  />
));
StoriesExplorer.propTypes = {
  stories: PropTypes.shape({}).isRequired,
  storyId: PropTypes.string,
};
StoriesExplorer.defaultProps = {
  storyId: undefined,
};

export default StoriesExplorer;
