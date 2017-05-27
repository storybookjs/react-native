import React from 'react';
import StackGrid from 'react-stack-grid';
import GridItem from '../GridItem';

export default ({ items, columnWidth }) => (
  <StackGrid columnWidth={columnWidth}>
    {items.map((item, idx) => <GridItem key={idx} {...item} />)}
  </StackGrid>
);
