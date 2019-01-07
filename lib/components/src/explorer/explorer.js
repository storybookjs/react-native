import React from 'react';
import PropTypes from 'prop-types';

import { TreeState } from '../treeview/treeview';
import Placeholder from '../placeholder/placeholder';

const Explorer = React.memo(({ stories, storyId, ...rest }) => {
  const list = Object.entries(stories);

  return list.length ? (
    <TreeState
      key="treestate"
      dataset={stories}
      prefix="explorer"
      {...rest}
      selectedId={storyId}
      filter=""
    />
  ) : (
    <Placeholder key="empty">There have no stories been loaded yet</Placeholder>
  );
});
Explorer.displayName = 'Explorer';
Explorer.propTypes = {
  stories: PropTypes.shape({}).isRequired,
  storyId: PropTypes.string,
};
Explorer.defaultProps = {
  storyId: null,
};

export { Explorer };
