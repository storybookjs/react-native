import { document } from 'global';
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

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
  DefaultSection,
  DefaultList,
  DefaultLink,
  DefaultLeaf,
  DefaultHead,
  DefaultRootTitle,
  DefaultFilter,
  DefaultMessage,
} from './components';

const createHandler = memoize(10000)((item, cb) => (...args) => cb(...args, item));

const linked = (C, { onClick, onKeyUp, prefix = '', Link: L }) => {
  const Linked = React.memo(p => (
    <L
      prefix={prefix}
      {...p}
      onKeyUp={createHandler(p, onKeyUp)}
      onClick={createHandler(p, onClick)}
    >
      <C {...p} />
    </L>
  ));
  Linked.displayName = `Linked${C.displayName}`;

  return Linked;
};

const getLink = memoize(1)(Link => Link || DefaultLink);

const getHead = memoize(1)((Head, Link, prefix, events) =>
  linked(Head || DefaultHead, {
    onClick: events.onClick,
    onKeyUp: events.onKeyUp,
    prefix,
    Link: getLink(Link),
  })
);

const getLeaf = memoize(1)((Leaf, Link, prefix, events) =>
  linked(Leaf || DefaultLeaf, {
    onClick: events.onClick,
    onKeyUp: events.onKeyUp,
    prefix,
    Link: getLink(Link),
  })
);

const getFilter = memoize(1)(Filter => Filter || DefaultFilter);
const getTitle = memoize(1)(Title => Title || DefaultRootTitle);
const getContainer = memoize(1)(Section => Section || DefaultSection);
const getMessage = memoize(1)(Message => Message || DefaultMessage);

const branchOrLeaf = (
  // eslint-disable-next-line react/prop-types
  { Branch, Leaf, Head, List },
  { root, dataset, expanded, selected, depth }
) => {
  const node = dataset[root];
  return node.children ? (
    <Branch
      key={node.id}
      {...{
        Branch,
        Leaf,
        Head,
        List,
        dataset,
        root,
        depth,
        expanded,
        selected,
      }}
    />
  ) : (
    <Leaf key={node.id} {...node} depth={depth} isSelected={selected[node.id]} />
  );
};

const Tree = props => {
  const {
    root,
    depth,
    dataset,
    expanded,
    selected,
    Branch = Tree,
    List = DefaultList,
    Leaf = DefaultLeaf,
    Head = DefaultHead,
  } = props;
  const { children, ...node } = dataset[root] || {};

  const mapNode = i =>
    branchOrLeaf(
      { Branch, Leaf, Head, List },
      { dataset, selected, expanded, root: i, depth: depth + 1 }
    );

  switch (true) {
    case !!(children && children.length && node.name): {
      return (
        <Fragment>
          <Head
            {...node}
            depth={depth}
            isExpanded={expanded[node.id]}
            isSelected={selected[node.id]}
          />
          {children && expanded[node.id] ? <List>{children.map(mapNode)}</List> : null}
        </Fragment>
      );
    }
    case !!(children && children.length): {
      return <List>{children.map(mapNode)}</List>;
    }
    default: {
      return null;
    }
  }
};

const calculateTreeState = memoize(50)(
  ({ dataset, selectedId }, { lastSelectedId, unfilteredExpanded }) => {
    if (selectedId === lastSelectedId) {
      return null;
    }

    // If a new selection is made, we need to ensure it is part of the expanded set
    const selectedAncestorIds = selectedId ? getParents(selectedId, dataset).map(i => i.id) : [];

    const newExpanded = Object.keys(dataset).reduce(
      (acc, key) => ({
        ...acc,
        [key]: selectedAncestorIds.includes(key) || unfilteredExpanded[key],
      }),
      {}
    );

    return {
      lastSelectedId: selectedId,
      unfilteredExpanded: newExpanded,
    };
  }
);

const getExpanded = ({ unfilteredExpanded, filteredExpanded, filter }) =>
  filter ? filteredExpanded : unfilteredExpanded;

const getFilteredDataset = memoize(50)(({ dataset, filter }) =>
  filter ? toFiltered(dataset, filter) : dataset
);

// Update the set of expansions we are currently working with
const updateExpanded = fn => ({ unfilteredExpanded, filteredExpanded, filter }) => {
  if (filter) {
    return {
      filteredExpanded: fn(filteredExpanded),
    };
  }
  return { unfilteredExpanded: fn(unfilteredExpanded) };
};

const getPropsForTree = memoize(50)(({ dataset, selectedId }) => {
  const selected = Object.keys(dataset).reduce(
    (acc, k) => Object.assign(acc, { [k]: k === selectedId }),
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

  return { selected, roots, others };
});

// eslint-disable-next-line react/no-multi-comp
class TreeState extends PureComponent {
  state = {
    // We maintain two sets of expanded nodes, so we remember which were expanded if we clear the filter
    unfilteredExpanded: [],
    filteredExpanded: [],
    filter: null,
    lastSelectedId: null,
  };

  static getDerivedStateFromProps(props, state) {
    return calculateTreeState(props, state);
  }

  events = {
    onClick: (e, item) => {
      this.setState(
        updateExpanded(expanded => ({
          ...expanded,
          [item.id]: !expanded[item.id],
        }))
      );
    },
    onFilter: inputFilter => {
      const { dataset } = this.props;
      const filter = inputFilter.length >= 2 ? inputFilter : '';
      const filteredDataset = getFilteredDataset({ dataset, filter });

      // Whenever we change the filter, we reset the "filtered" expanded set back to all matching stories
      this.setState({
        filter,
        filteredExpanded:
          !!filter &&
          Object.keys(filteredDataset).reduce((acc, k) => Object.assign(acc, { [k]: true }), {}),
      });
    },
    onKeyUp: (e, item) => {
      const { prefix, dataset } = this.props;
      const { filter } = this.state;
      const filteredDataset = getFilteredDataset({ dataset, filter });
      const expanded = getExpanded(this.state);

      const action = keyEventToAction(e);
      if (action) {
        prevent(e);
      }

      if (action === 'RIGHT') {
        const next = getNext({ id: item.id, dataset: filteredDataset, expanded });
        if (!filteredDataset[item.id].children || expanded[item.id]) {
          if (next) {
            try {
              document.getElementById(createId(next.id, prefix)).focus();
            } catch (err) {
              // debugger;
            }
          }
        }

        this.setState(updateExpanded(currExpanded => ({ ...currExpanded, [item.id]: true })));
      }
      if (action === 'LEFT') {
        const prev = getPrevious({ id: item.id, dataset: filteredDataset, expanded });

        if (!filteredDataset[item.id].children || !expanded[item.id]) {
          const parent = getParent(item.id, filteredDataset);
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

        this.setState(updateExpanded(currExpanded => ({ ...currExpanded, [item.id]: false })));
      }
      if (action === 'DOWN') {
        const next = getNext({ id: item.id, dataset: filteredDataset, expanded });
        if (next) {
          try {
            document.getElementById(createId(next.id, prefix)).focus();
          } catch (err) {
            // debugger;
          }
        }
      }
      if (action === 'UP') {
        const prev = getPrevious({ id: item.id, dataset: filteredDataset, expanded });

        if (prev) {
          try {
            document.getElementById(createId(prev.id, prefix)).focus();
          } catch (err) {
            // debugger;
          }
        }
      }
    },
  };

  render() {
    const {
      events,
      state: { filter, unfilteredExpanded, filteredExpanded },
      props,
    } = this;
    const { prefix, dataset, selectedId } = props;

    const Filter = getFilter(props.Filter);
    const List = getFilter(props.List);
    const Branch = Tree;
    const Title = getTitle(props.Title);
    const Link = getLink(props.Link);
    const Leaf = getLeaf(props.Leaf, Link, prefix, events);
    const Head = getHead(props.Head, Link, prefix, events);
    const Section = getContainer(props.Section);
    const Message = getMessage(props.Message);

    const filteredDataset = getFilteredDataset({ dataset, filter });
    const expanded = filter ? filteredExpanded : unfilteredExpanded;
    const { selected, roots, others } = getPropsForTree({ dataset: filteredDataset, selectedId });

    return (
      <Fragment>
        {Filter ? <Filter key="filter" onChange={this.events.onFilter} /> : null}
        {roots.length || others.length ? (
          <Fragment>
            {roots.map(({ id, name, children }) => (
              <Section key={id}>
                <Title type="section" mods={['uppercase']}>
                  {name}
                </Title>
                {children.map(key => (
                  <Branch
                    key={key}
                    depth={0}
                    dataset={filteredDataset}
                    selected={selected}
                    expanded={expanded}
                    root={key}
                    events={events}
                    Head={Head}
                    Leaf={Leaf}
                    Branch={Branch}
                    List={List}
                  />
                ))}
              </Section>
            ))}
            {others.length ? (
              <Section key="other">
                {roots.length ? (
                  <Title type="section" mods={['uppercase']}>
                    Others
                  </Title>
                ) : null}
                {others.map(({ id }) => (
                  <Branch
                    key={id}
                    depth={0}
                    dataset={filteredDataset}
                    selected={selected}
                    expanded={expanded}
                    root={id}
                    events={events}
                    Link={Link}
                    Head={Head}
                    Leaf={Leaf}
                    Branch={Branch}
                  />
                ))}
              </Section>
            ) : null}
          </Fragment>
        ) : (
          <Message>This filter resulted in 0 results</Message>
        )}
      </Fragment>
    );
  }
}

TreeState.propTypes = {
  prefix: PropTypes.string.isRequired,
  dataset: PropTypes.shape({}).isRequired,
  // We do use this prop, eslint is confused
  // eslint-disable-next-line react/no-unused-prop-types
  selectedId: PropTypes.string,
};
TreeState.defaultProps = {
  selectedId: null,
};

export { TreeState, Tree };
