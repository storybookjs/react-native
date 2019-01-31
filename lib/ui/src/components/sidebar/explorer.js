import React from 'react';
import PropTypes from 'prop-types';

import { Explorer } from '@storybook/components';

import { Section, List, Link, Leaf, Head, Title, Filter } from './explorer-components';

const StoriesPanel = React.memo(props => (
  <Explorer
    {...props}
    List={List}
    Head={Head}
    Link={Link}
    Leaf={Leaf}
    Title={Title}
    Section={Section}
    Filter={Filter}
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
