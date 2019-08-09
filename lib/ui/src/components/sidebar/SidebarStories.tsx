import React, { Fragment, FunctionComponent } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';
import { Placeholder, Link as StyledLink } from '@storybook/components';
import { State } from '@storybook/api';
import { Location, Link as RouterLink } from '@storybook/router';
import { TreeState } from './treeview/treeview';

import SidebarItem from './SidebarItem';
import SidebarSearch from './SidebarSearch';
import SidebarSubheading from './SidebarSubheading';

const Search = styled(SidebarSearch)({
  margin: '0 20px 1rem',
});

const Subheading = styled(SidebarSubheading)({
  margin: '0 20px',
});

Subheading.propTypes = {
  className: PropTypes.string,
};

Subheading.defaultProps = {
  className: 'sidebar-subheading',
};

const Section = styled.section({
  '& + section': {
    marginTop: 20,
  },
  '&:last-of-type': {
    marginBottom: 40,
  },
});

const List = styled.div();
List.displayName = 'List';

const plain = {
  color: 'inherit',
  display: 'block',
  textDecoration: 'none',
  userSelect: 'none',
};
// @ts-ignore
const PlainRouterLink = styled(RouterLink)(plain);
// @ts-ignore
const PlainLink = styled.a(plain);

const Wrapper = styled.div({});

const refinedViewMode = (viewMode: string | undefined, isDocsOnly: boolean) => {
  if (isDocsOnly) {
    return 'docs';
  }
  return viewMode === 'settings' || !viewMode ? 'story' : viewMode;
};

const targetId = (childIds?: string[]) =>
  childIds && childIds.find((childId: string) => /.*--.*/.exec(childId));

export const Link = ({
  id,
  prefix,
  name,
  children,
  isLeaf,
  isComponent,
  onClick,
  onKeyUp,
  childIds,
  isExpanded,
}) => {
  return isLeaf || (isComponent && !isExpanded) ? (
    <Location>
      {({ viewMode }) => (
        <PlainRouterLink
          title={name}
          id={prefix + id}
          to={`/${refinedViewMode(viewMode, isLeaf && isComponent)}/${targetId(childIds) || id}`}
          onKeyUp={onKeyUp}
          onClick={onClick}
        >
          {children}
        </PlainRouterLink>
      )}
    </Location>
  ) : (
    <PlainLink title={name} id={prefix + id} onKeyUp={onKeyUp} onClick={onClick}>
      {children}
    </PlainLink>
  );
};
Link.displayName = 'Link';
Link.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isLeaf: PropTypes.bool.isRequired,
  prefix: PropTypes.string.isRequired,
  onKeyUp: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  childIds: PropTypes.arrayOf(PropTypes.string),
  isExpanded: PropTypes.bool,
};
Link.defaultProps = {
  childIds: null,
  isExpanded: false,
};

export interface StoriesProps {
  loading: boolean;
  stories: State['StoriesHash'];
  storyId?: undefined | string;
  className?: undefined | string;
}

const SidebarStories: FunctionComponent<StoriesProps> = React.memo(
  ({ stories, storyId, loading, className, ...rest }) => {
    const list = Object.entries(stories);

    if (loading) {
      return (
        <Wrapper className={className}>
          <SidebarItem loading />
          <SidebarItem loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={2} loading />
          <SidebarItem depth={3} loading />
          <SidebarItem depth={3} loading />
          <SidebarItem depth={3} loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={1} loading />
          <SidebarItem depth={2} loading />
          <SidebarItem depth={2} loading />
          <SidebarItem depth={2} loading />
          <SidebarItem depth={3} loading />
          <SidebarItem loading />
          <SidebarItem loading />
        </Wrapper>
      );
    }

    if (list.length < 1) {
      return (
        <Wrapper className={className}>
          <Placeholder key="empty">
            <Fragment key="title">No stories found</Fragment>
            <Fragment>
              Learn how to{' '}
              <StyledLink href="https://storybook.js.org/basics/writing-stories/" target="_blank">
                write stories
              </StyledLink>
            </Fragment>
          </Placeholder>
        </Wrapper>
      );
    }

    return (
      <Wrapper className={className}>
        <TreeState
          key="treestate"
          dataset={stories}
          prefix="explorer"
          selectedId={storyId}
          filter=""
          List={List}
          Head={SidebarItem}
          Link={Link}
          Leaf={SidebarItem}
          Title={Subheading}
          Section={Section}
          Message={Placeholder}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          Filter={Search}
          {...rest}
        />
      </Wrapper>
    );
  }
);

export default SidebarStories;
