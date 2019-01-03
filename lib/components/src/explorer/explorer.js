import React from 'react';
import PropTypes from 'prop-types';

import memoize from 'memoizerific';

import { TreeState } from '../treeview/treeview';
import Placeholder from '../placeholder/placeholder';
import { getParents } from '../treeview/utils';

const toSelected = memoize(50)((id, stories) =>
  Object.keys(stories).reduce((acc, k) => Object.assign(acc, { [k]: k === id }), {})
);
const toExpanded = memoize(50)((selected, stories) => {
  const parents = Object.entries(selected)
    .reduce((acc, [k, v]) => (v ? acc.concat(k) : acc), [])
    .reduce(
      (acc, id) => acc.concat(getParents({ path: id, dataset: stories }).map(i => i.path)),
      []
    );
  return Object.keys(stories).reduce(
    (acc, k) => Object.assign(acc, { [k]: parents.includes(k) }),
    {}
  );
});

const Explorer = React.memo(({ stories, storyId, ...rest }) => {
  const list = Object.entries(stories);
  const selected = toSelected(storyId, stories);
  const expanded = toExpanded(selected, stories);

  return list.length ? (
    <TreeState
      key="treestate"
      dataset={stories}
      prefix="explorer"
      {...rest}
      selected={selected}
      expanded={expanded}
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

export { Explorer };
