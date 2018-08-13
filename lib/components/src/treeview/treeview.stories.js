import React from 'react';
// import styled from 'react-emotion';
import { storiesOf } from '@storybook/react';

import { Tree, Container, TreeState, Leaf } from './treeview';

const datasets = {
  a: [
    {
      id: 1,
      name: 'Parent A',
      isExpanded: true,
      children: [
        {
          id: 11,
          name: 'Child A1',
          isSelected: true,
        },
        {
          id: 12,
          name: 'Child A2',
          isExpanded: false,
          children: [
            {
              id: 121,
              name: 'GrandChild A1.1',
            },
            {
              id: 122,
              name: 'GrandChild A1.2',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Parent B',
      isExpanded: true,
      isSelected: true,
      children: [
        {
          id: 21,
          name: 'Child B1',
        },
        {
          id: 22,
          name: 'Child B2',
        },
      ],
    },
  ],
};

const CustomLeaf = p => <Leaf {...p} name={`! ${p.name}`} />;
CustomLeaf.displayName = 'CustomLeaf';

storiesOf('Components|Treeview', module)
  .add('stateless', () => (
    <Container>
      <Tree prefix="stateless" dataset={datasets.a} />
    </Container>
  ))
  .add('stateful', () => (
    <Container>
      <TreeState prefix="stateful" dataset={datasets.a} />
    </Container>
  ))
  .add('with custom node', () => (
    <Container>
      <TreeState prefix="stateful" dataset={datasets.a} LeafNode={CustomLeaf} />
    </Container>
  ));
