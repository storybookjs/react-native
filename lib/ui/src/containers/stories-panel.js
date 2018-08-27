import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { inject } from 'mobx-react';
import { Explorer } from '@storybook/components';
import { Link } from '../router';

import { toNested } from '../libs/nav/nav';

const idToPath = id => `/components/${id.replace('treeview_explorer-', '')}` || '/components';

const LeafLink = styled(({ id, children, className, ...rest }) => (
  <Link id={id} className={className} to={idToPath(id)} {...rest}>
    {children}
  </Link>
))({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  color: 'inherit',
  textDecoration: 'none',
});

const StoriesPanel = ({ stories, hierarchyRootSeparator, hierarchySeparator }) => (
  <Explorer
    allowClick
    stories={toNested(stories, {
      rootSeperator: hierarchyRootSeparator,
      groupSeperator: hierarchySeparator,
    })}
    Link={LeafLink}
  />
);
StoriesPanel.propTypes = {
  stories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hierarchyRootSeparator: PropTypes.string.isRequired,
  hierarchySeparator: PropTypes.string.isRequired,
};

export default inject(({ store }) => ({
  stories: store.stories,
  hierarchyRootSeparator: store.uiOptions.hierarchyRootSeparator,
  hierarchySeparator: store.uiOptions.hierarchySeparator,
}))(StoriesPanel);
