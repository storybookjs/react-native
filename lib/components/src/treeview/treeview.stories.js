import React from 'react';
import styled from '@emotion/styled';
import { storiesOf } from '@storybook/react';

import { Tree, TreeState, Leaf } from './treeview';

import { mockDataset, mockSelected, mockExpanded } from './treeview.mockdata';

const CustomLeaf = styled(Leaf)(({ isSelected }) => ({
  background: isSelected ? 'hotpink' : 'deepskyblue',
}));
CustomLeaf.displayName = 'CustomLeaf';

storiesOf('Components|Treeview', module)
  .add('stateful', () => (
    <TreeState
      prefix="stateful"
      dataset={mockDataset.noRoot}
      expanded={mockExpanded.noRoot}
      selected={mockSelected.noRoot}
    />
  ))
  .add('stateless', () => (
    <Tree
      prefix="stateless"
      dataset={mockDataset.noRoot}
      root="1"
      expanded={mockExpanded.noRoot}
      selected={mockSelected.noRoot}
    />
  ))
  .add('with custom node', () => (
    <TreeState
      prefix="stateful"
      dataset={mockDataset.noRoot}
      LeafNode={CustomLeaf}
      expanded={mockExpanded.noRoot}
      selected={mockSelected.noRoot}
    />
  ))
  .add('with roots node', () => (
    <TreeState
      prefix="stateful"
      dataset={mockDataset.withRoot}
      expanded={mockExpanded.withRoot}
      selected={mockSelected.withRoot}
    />
  ))
  .add('with ensured (WIP)', () => (
    <TreeState
      prefix="stateful"
      dataset={mockDataset.withRoot}
      ensured={['1-12-122']}
      expanded={mockExpanded.withRoot}
      selected={mockSelected.withRoot}
    />
  ));
