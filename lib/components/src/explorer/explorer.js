import React, { Component } from 'react';
import PropTypes from 'prop-types';

import memoize from 'memoizerific';

import { TreeState } from '../treeview/treeview';
import Placeholder from '../placeholder/placeholder';
import { getParents } from '../treeview/utils';

const toSelected = memoize(50)((id, stories) =>
  Object.keys(stories).reduce((acc, k) => Object.assign(acc, { [k]: k === id }), {})
);
const toExpanded = memoize(50)((selectedIds, stories) => {
  const parents = selectedIds.reduce(
    (acc, id) => acc.concat(getParents({ path: id, dataset: stories }).map(i => i.path)),
    []
  );
  return Object.keys(stories).reduce(
    (acc, k) => Object.assign(acc, { [k]: parents.includes(k) }),
    {}
  );
});

// This component gets a ref so it needs to be a class
// eslint-disable-next-line react/prefer-stateless-function
class Explorer extends Component {
  shouldComponentUpdate(nextProps) {
    const { props: prevProps } = this;

    return !(
      prevProps.stories === nextProps.stories && prevProps.componentId === nextProps.componentId
    );

    return false;
  }

  render() {
    const { stories, componentId, ...rest } = this.props;
    const list = Object.entries(stories);
    const selected = toSelected(componentId, stories);
    const expanded = toExpanded(
      Object.entries(selected).reduce((acc, [k, v]) => (v ? acc.concat(k) : acc), []),
      stories
    );

    return list.length ? (
      <TreeState
        dataset={stories}
        prefix="explorer"
        {...rest}
        selected={selected}
        expanded={expanded}
        filter=""
      />
    ) : (
      <Placeholder>There have no stories been loaded yet</Placeholder>
    );
  }
}

Explorer.propTypes = {
  stories: PropTypes.shape({}).isRequired,
  componentId: PropTypes.string,
};

export { Explorer };
