import React, { PureComponent } from 'react';
import styled from 'react-emotion';
import produce from 'immer';
import { document } from 'global';

import {
  createId,
  prevent,
  isMacLike,
  keyEventToAction,
  getParent,
  getPrevious,
  getSelected,
  getNext,
  toDataset,
  toNested,
} from './utils';

import { Container, TreeWrapper, ListWrapper, Link, DefaultLeaf, DefaultHead } from './components';

const linked = (C, { events, prefix = '' }) => {
  const Linked = p => (
    <Link
      href="#!leaf"
      id={createId(p.path, prefix)}
      path={p.path}
      {...Object.entries(events).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: (...args) => v(...args, p),
        }),
        {}
      )}
    >
      <C {...p} />
    </Link>
  );
  Linked.displayName = `Linked${C.displayName}`;

  return Linked;
};

const branchOrLeaf = ({ Branch, Leaf, Head }, node) =>
  node.children ? (
    <Branch key={node.path} {...node} {...{ Branch, Leaf, Head }} />
  ) : (
    <Leaf key={node.path} {...node} />
  );

const Tree = ({
  prefix,
  children,
  dataset = children,
  Branch = Tree,
  LeafNode,
  HeadNode,
  isExpanded = true,
  ...rest
}) => {
  const events = rest.events || {};
  const Leaf = rest.Leaf || linked(LeafNode || DefaultLeaf, { events, prefix });
  const Head = rest.Head || linked(HeadNode || DefaultHead, { events, prefix });

  switch (true) {
    case !!(dataset && rest.name): {
      return (
        <TreeWrapper>
          <Head {...rest} path={rest.path} isExpanded={isExpanded} />
          {dataset && isExpanded ? (
            <ListWrapper>{dataset.map(i => branchOrLeaf({ Branch, Leaf, Head }, i))}</ListWrapper>
          ) : null}
        </TreeWrapper>
      );
    }
    case !!(dataset && dataset.length): {
      return <ListWrapper>{dataset.map(i => branchOrLeaf({ Branch, Leaf, Head }, i))}</ListWrapper>;
    }
    default: {
      return null;
    }
  }
};

class TreeState extends PureComponent {
  constructor(props, ...rest) {
    super(props, ...rest);

    const { Branch, LeafNode, HeadNode, dataset: data, prefix, ...other } = props;

    const dataset = toDataset(data);
    const nested = toNested(dataset);

    this.state = {
      dataset,
      nested,
    };

    this.events = {
      onClick: (e, item) => {
        prevent(e);
        const { dataset } = this.state;
        const selected = getSelected({ dataset });

        const add = isMacLike ? e.metaKey : e.ctrlKey;

        const replacement = produce(dataset, set => {
          set[item.path].isSelected = true;

          if (set[item.path].children) {
            set[item.path].isExpanded = true;
          }

          if (!add) {
            selected.forEach(i => {
              set[i.path].isSelected = false;
            });
          }
        });

        this.setState({
          dataset: replacement,
          nested: toNested(replacement),
        });
      },
      onKeyUp: (e, item) => {
        const { dataset } = this.state;
        const action = keyEventToAction(e);
        if (action === 'RIGHT') {
          if (!dataset[item.path].children || dataset[item.path].isExpanded) {
            const next = getNext({ path: item.path, dataset });
            if (next) {
              document.getElementById(createId(next.path, prefix)).focus();
            }
          }
          const replacement = produce(dataset, set => {
            set[item.path].isExpanded = true;
          });

          this.setState({
            dataset: replacement,
            nested: toNested(replacement),
          });
        }
        if (action === 'LEFT') {
          if (!dataset[item.path].children || !dataset[item.path].isExpanded) {
            const parent = getParent({ path: item.path, dataset });
            if (parent && parent.children) {
              document.getElementById(createId(parent.path, prefix)).focus();
            } else {
              const prev = getPrevious({ path: item.path, dataset });
              if (prev) {
                document.getElementById(createId(prev.path, prefix)).focus();
              }
            }
          }
          const replacement = produce(dataset, set => {
            set[item.path].isExpanded = false;
          });

          this.setState({
            dataset: replacement,
            nested: toNested(replacement),
          });
        }
        if (action === 'DOWN') {
          const next = getNext({ path: item.path, dataset });
          if (next) {
            document.getElementById(createId(next.path, prefix)).focus();
          }
        }
        if (action === 'UP') {
          const prev = getPrevious({ path: item.path, dataset });
          if (prev) {
            document.getElementById(createId(prev.path, prefix)).focus();
          }
        }
      },
    };

    this.Branch = other.Branch || Tree;
    this.Leaf = other.Leaf || linked(LeafNode || DefaultLeaf, { events: this.events, prefix });
    this.Head = other.Head || linked(HeadNode || DefaultHead, { events: this.events, prefix });
  }

  render() {
    const { Head, Leaf, Branch, events } = this;
    const { nested } = this.state;
    return <Branch dataset={nested} events={events} Head={Head} Leaf={Leaf} Branch={Branch} />;
  }
}

export { TreeState, Tree, DefaultLeaf as Leaf, DefaultHead as Head, Container };
