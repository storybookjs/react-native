import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TreeState } from '../treeview/treeview';
import Placeholder from '../placeholder/placeholder';

// This component gets a ref so it needs to be a class
// eslint-disable-next-line react/prefer-stateless-function
class Explorer extends Component {
  render() {
    const { stories, ...rest } = this.props;
    const list = Object.entries(stories);

    return list.length ? (
      <TreeState dataset={stories} prefix="explorer" {...rest} />
    ) : (
      <Placeholder>There have no stories been loaded yet</Placeholder>
    );
  }
}

Explorer.propTypes = {
  stories: PropTypes.shape({}).isRequired,
};

export { Explorer };
