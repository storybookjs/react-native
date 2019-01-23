import React from 'react';
import PropTypes from 'prop-types';

import { Explorer } from '@storybook/components';

import { Section, List, Link, Leaf, Head, Title, Filter } from './explorer-components';

const StoriesPanel = React.memo(props => (
  <Explorer
    allowClick
    {...props}
    ListNode={List}
    HeadNode={Head}
    LinkNode={Link}
    LeafNode={Leaf}
    TitleNode={Title}
    SectionNode={Section}
    FilterNode={Filter}
  />
));
StoriesPanel.propTypes = {
  stories: PropTypes.shape({}).isRequired,
  storyId: PropTypes.string,
};
StoriesPanel.defaultProps = {
  storyId: undefined,
};

export { StoriesPanel as StoriesExplorer };
