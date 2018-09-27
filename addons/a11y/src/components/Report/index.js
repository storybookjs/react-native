import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Placeholder } from '@storybook/components';

import Item from './Item';

const Report = ({ items, empty, passes }) => (
  <Fragment>
    {items.length ? (
      items.map(item => <Item passes={passes} item={item} key={item.id} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Fragment>
);

Report.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      nodes: PropTypes.array,
      tags: PropTypes.array,
    })
  ).isRequired,
  empty: PropTypes.string.isRequired,
  passes: PropTypes.bool.isRequired,
};

export default Report;
