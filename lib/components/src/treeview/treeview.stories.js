import React from 'react';
import { styled } from '@storybook/theming';
import { storiesOf } from '@storybook/react';

import { Tree, TreeState } from './treeview';
import { DefaultLeaf } from './components';

import { mockDataset, mockSelected, mockExpanded } from './treeview.mockdata';

const CustomLeaf = styled(DefaultLeaf)(({ isSelected }) => ({
  background: isSelected ? 'hotpink' : 'deepskyblue',
}));
CustomLeaf.displayName = 'CustomLeaf';

storiesOf('Components|Treeview', module)
  .add('stateful', () => (
    <TreeState
      filter=""
      prefix="stateful"
      dataset={mockDataset.noRoot}
      expanded={mockExpanded.noRoot}
      selected={mockSelected.noRoot}
    />
  ))
  .add('stateless', () => (
    <Tree
      filter=""
      prefix="stateless"
      dataset={mockDataset.noRoot}
      root="1"
      depth={0}
      expanded={mockExpanded.noRoot}
      selected={mockSelected.noRoot}
      events={{ onClick: () => {}, onKeyUp: () => {} }}
    />
  ))
  .add('stateless changed expanded', () => (
    <Tree
      filter=""
      prefix="stateless"
      dataset={mockDataset.noRoot}
      root="1"
      depth={0}
      expanded={mockExpanded.noRootSecond}
      selected={mockSelected.noRoot}
      events={{ onClick: () => {}, onKeyUp: () => {} }}
    />
  ))
  .add('with custom node', () => (
    <TreeState
      filter=""
      prefix="stateful"
      dataset={mockDataset.noRoot}
      Leaf={CustomLeaf}
      expanded={mockExpanded.noRoot}
      selected={mockSelected.noRoot}
    />
  ))
  .add('with roots node', () => (
    <TreeState
      filter=""
      prefix="stateful"
      dataset={mockDataset.withRoot}
      expanded={mockExpanded.withRoot}
      selected={mockSelected.withRoot}
    />
  ));
