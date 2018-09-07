import React from 'react';
import { storiesOf } from '@storybook/react';

import { Tree, TreeState, Leaf } from './treeview';

import { mockdata } from './treeview.mockdata';

const CustomLeaf = p => <Leaf {...p} name={`! ${p.name}`} />;
CustomLeaf.displayName = 'CustomLeaf';

storiesOf('Components|Treeview', module)
  .add('stateless', () => <Tree prefix="stateless" dataset={mockdata.dataset} root="root" />)
  .add('stateful', () => <TreeState prefix="stateful" dataset={mockdata.dataset} />)
  .add('with custom node', () => (
    <TreeState prefix="stateful" dataset={mockdata.dataset} LeafNode={CustomLeaf} />
  ));
