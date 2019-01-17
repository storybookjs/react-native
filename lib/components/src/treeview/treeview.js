import { document } from 'global';
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import Placeholder from '../placeholder/placeholder';

import {
  createId,
  prevent,
  keyEventToAction,
  getParent,
  getParents,
  getPrevious,
  getMains,
  getNext,
  toFiltered,
} from './utils';

import {
  Container,
  TreeWrapper,
  ListWrapper,
  Link,
  DefaultLeaf,
  DefaultHead,
  DefaultRootTitle,
  Filter as FilterField,
} from './components';

const createHandler = memoize(10000)((item, cb) => (...args) => cb(...args, item));

const linked = (C, { onClick, onKeyUp, prefix = '', Link: L }) => {
  const Linked = React.memo(p => (
    <L
      href={`#!${p.id}`}
      id={`${prefix}_${p.id}`}
      onKeyUp={createHandler(p, onKeyUp)}
      onClick={createHandler(p, onClick)}
    >
      <C {...p} />
    </L>
  ));
  Linked.displayName = `Linked${C.displayName}`;

  return Linked;
};

// eslint-disable-next-line react/prop-types
const branchOrLeaf = ({ Branch, Leaf, Head }, { root, dataset, expanded, selected, depth }) => {
  const node = dataset[root];
  return node.children ? (
    <Branch key={node.id} {...{ Branch, Leaf, Head, dataset, root, depth, expanded, selected }} />
  ) : (
    <Leaf key={node.id} {...node} depth={depth} isSelected={selected[node.id]} />
  );
};

const Tree = ({
  prefix,
  root,
  depth,
  dataset,
  expanded,
  selected,
  Branch = Tree,
  LeafNode,
  HeadNode,
  ...rest
}) => {
  const { children, ...node } = dataset[root] || {};
  const Leaf =
    rest.Leaf ||
    linked(LeafNode || DefaultLeaf, {
      onClick: rest.events.onClick,
      onKeyUp: rest.events.onKeyUp,
      prefix,
      Link,
    });
  const Head =
    rest.Head ||
    linked(HeadNode || DefaultHead, {
      onClick: rest.events.onClick,
      onKeyUp: rest.events.onKeyUp,
      prefix,
      Link,
    });

  const mapNode = i =>
    branchOrLeaf(
      { Branch, Leaf, Head },
      { dataset, selected, expanded, root: i, depth: depth + 1 }
    );

  switch (true) {
    case !!(children && node.name): {
      return (
        <TreeWrapper>
          <Head
            {...node}
            depth={depth}
            isExpanded={expanded[node.id]}
            isSelected={selected[node.id]}
          />
          {children && expanded[node.id] ? (
            <ListWrapper>{children.map(mapNode)}</ListWrapper>
          ) : null}
        </TreeWrapper>
      );
    }
    case !!(children && children.length): {
      return <ListWrapper>{children.map(mapNode)}</ListWrapper>;
    }
    default: {
      return null;
    }
  }
};

const calculateTreeProps = memoize(50)((input, filter, selectedId, extraExpanded) => {
  const dataset = filter ? toFiltered(input, filter) : input;

  const selected = Object.keys(dataset).reduce(
    (acc, k) => Object.assign(acc, { [k]: k === selectedId }),
    {}
  );

  const selectedAncestorIds = selectedId
    ? getParents({ id: selectedId, dataset }).map(i => i.id)
    : [];

  const expanded = Object.keys(dataset).reduce(
    (acc, key) => ({
      ...acc,
      [key]: selectedAncestorIds.includes(key) || extraExpanded[key],
    }),
    {}
  );

  const { roots, others } = getMains(dataset).reduce(
    (acc, item) => {
      const { isRoot } = item;
      return isRoot
        ? { ...acc, roots: [...acc.roots, item] }
        : { ...acc, others: [...acc.others, item] };
    },
    { roots: [], others: [] }
  );

  return { input, dataset, selected, expanded, roots, others };
});

// eslint-disable-next-line react/no-multi-comp
class TreeState extends PureComponent {
  events = {
    onClick: (e, item) => {
      const { allowNonLeaf, allowClick } = this.props;
      const { dataset } = this.props;
      const isLeaf = !dataset[item.id].children;

      if (!((allowNonLeaf || isLeaf) && allowClick) || !(!allowNonLeaf && allowClick)) {
        prevent(e);
      }

      const { extraExpanded } = this.state;
      this.setState({
        extraExpanded: {
          ...extraExpanded,
          [item.id]: !extraExpanded[item.id],
        },
      });
    },
    onKeyUp: (e, item) => {
      const { dataset: input, selectedId, prefix } = this.props;
      const { filter, extraExpanded } = this.state;
      const { dataset, expanded } = calculateTreeProps(input, filter, selectedId, extraExpanded);

      const action = keyEventToAction(e);
      if (action) {
        prevent(e);
      }

      if (action === 'RIGHT') {
        const next = getNext({ id: item.id, dataset, expanded });
        if (!dataset[item.id].children || expanded[item.id]) {
          if (next) {
            try {
              document.getElementById(createId(next.id, prefix)).focus();
            } catch (err) {
              // debugger;
            }
          }
        }

        this.setState({ extraExpanded: { ...extraExpanded, [item.id]: true } });
      }
      if (action === 'LEFT') {
        const prev = getPrevious({ id: item.id, dataset, expanded });

        if (!dataset[item.id].children || !expanded[item.id]) {
          const parent = getParent({ id: item.id, dataset });
          if (parent && parent.children) {
            try {
              document.getElementById(createId(parent.id, prefix)).focus();
            } catch (err) {
              // debugger;
            }

            if (prev) {
              try {
                document.getElementById(createId(prev.id, prefix)).focus();
              } catch (err) {
                // debugger;
              }
            }
          }
        }

        this.setState({ extraExpanded: { ...extraExpanded, [item.id]: false } });
      }
      if (action === 'DOWN') {
        const next = getNext({ id: item.id, dataset, expanded });
        if (next) {
          try {
            document.getElementById(createId(next.id, prefix)).focus();
          } catch (err) {
            // debugger;
          }
        }
      }
      if (action === 'UP') {
        const prev = getPrevious({ id: item.id, dataset, expanded });

        if (prev) {
          try {
            document.getElementById(createId(prev.id, prefix)).focus();
          } catch (err) {
            // debugger;
          }
        }
      }
    },

    onFilter: e => {
      const filter = e.target.value.length >= 2 ? e.target.value : '';
      this.setState({ filter });
    },
  };

  constructor(props) {
    super(props);

    const { LeafNode, HeadNode, prefix, ...other } = props;
    this.state = {
      filter: null,
      extraExpanded: {},
    };

    this.Filter = other.Filter || FilterField;
    this.Link = other.Link || Link;
    this.Branch = other.Branch || Tree;
    this.RootTitle = other.RootTitle || DefaultRootTitle;
    this.Leaf =
      other.Leaf ||
      linked(LeafNode || DefaultLeaf, {
        onClick: this.events.onClick,
        onKeyUp: this.events.onKeyUp,
        prefix,
        Link: this.Link,
      });
    this.Head =
      other.Head ||
      linked(HeadNode || DefaultHead, {
        onClick: this.events.onClick,
        onKeyUp: this.events.onKeyUp,
        prefix,
        Link: this.Link,
      });
  }

  render() {
    const {
      Head,
      Leaf,
      Branch,
      Filter,
      RootTitle,
      events,
      props: { dataset: input, selectedId },
      state: { filter, extraExpanded },
    } = this;

    const { dataset, selected, expanded, roots, others } = calculateTreeProps(
      input,
      filter,
      selectedId,
      extraExpanded
    );

    return (
      <Fragment>
        {Filter ? <Filter key="filter" onChange={this.events.onFilter} /> : null}
        {roots.length || others.length ? (
          <Fragment>
            {roots.map(({ id, name, children }) => (
              <Fragment key={id}>
                <RootTitle type="section" mods={['uppercase']}>
                  {name}
                </RootTitle>
                <Container>
                  {children.map(key => (
                    <Branch
                      key={key}
                      depth={0}
                      dataset={dataset}
                      selected={selected}
                      expanded={expanded}
                      root={key}
                      events={events}
                      Head={Head}
                      Leaf={Leaf}
                      Branch={Branch}
                    />
                  ))}
                </Container>
              </Fragment>
            ))}
            {roots.length && others.length ? (
              <RootTitle type="section" mods={['uppercase']}>
                Others
              </RootTitle>
            ) : null}
            {others.length ? (
              <Container>
                {others.map(({ id }) => (
                  <Branch
                    key={id}
                    depth={0}
                    dataset={dataset}
                    selected={selected}
                    expanded={expanded}
                    root={id}
                    events={events}
                    Head={Head}
                    Leaf={Leaf}
                    Branch={Branch}
                  />
                ))}
              </Container>
            ) : null}
          </Fragment>
        ) : (
          <Placeholder>This filter resulted in 0 results</Placeholder>
        )}
      </Fragment>
    );
  }
}

TreeState.propTypes = {
  prefix: PropTypes.string.isRequired,
  allowMultiple: PropTypes.bool,
  allowNonLeaf: PropTypes.bool,
  allowClick: PropTypes.bool,

  dataset: PropTypes.shape({}).isRequired,
  selectedId: PropTypes.string,
  filter: PropTypes.string.isRequired,

  LeafNode: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  HeadNode: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  Filter: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  Link: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  Branch: PropTypes.func,
  Leaf: PropTypes.func,
  Head: PropTypes.func,
  RootTitle: PropTypes.func,
};
TreeState.defaultProps = {
  allowMultiple: false,
  allowNonLeaf: false,
  allowClick: false,
  selectedId: null,
  LeafNode: undefined,
  HeadNode: undefined,
  Filter: undefined,
  Link: undefined,
  Branch: undefined,
  Leaf: undefined,
  Head: undefined,
  RootTitle: undefined,
};

export { TreeState, Tree, DefaultLeaf as Leaf, DefaultHead as Head, Container };
