/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import StackGrid from 'react-stack-grid';
import GridItem from '../GridItem';

const Grid = ({ items, columnWidth }) => (
  <StackGrid columnWidth={columnWidth}>
    {items.map((item, idx) => <GridItem key={idx} {...item} />)}
  </StackGrid>
);
Grid.propTypes = {
  items: PropTypes.array, // eslint-disable-line
  columnWidth: PropTypes.number,
};
Grid.defaultProps = {
  items: [],
  columnWidth: 150,
};

export { Grid as default };
