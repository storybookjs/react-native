import { Treebeard, decorators } from 'react-treebeard';
import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '../theme';

const namespaceSeparator = '@';
const treeStyle = {
  tree: {
    base: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      fontFamily: baseFonts.fontFamily,
      fontSize: '15px',
    },
    node: {
      base: {
        position: 'relative',
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '0px 5px',
        display: 'block',
      },
      activeLink: {
        fontWeight: 'bold',
        backgroundColor: '#EEE',
      },
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          marginLeft: '-5px',
          height: '24px',
          width: '24px',
        },
        wrapper: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-10px 0 0 -4px',
        },
        height: 10,
        width: 10,
        arrow: {
          fill: '#9DA5AB',
          strokeWidth: 0,
        },
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'top',
          // color: '#9DA5AB'
        },
        connector: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px',
        },
        title: {
          lineHeight: '24px',
          verticalAlign: 'middle',
        },
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '19px',
      },
    },
  },
};

function HeaderDecorator(props) {
  const { style, node } = props;

  const newStyleTitle = {
    ...style.title,
  };

  if (!node.children || !node.children.length) {
    newStyleTitle.fontSize = '13px';
  }

  return (
    <div style={style.base}>
      <div style={newStyleTitle}>
        {node.name}
      </div>
    </div>
  );
}

HeaderDecorator.propTypes = {
  style: PropTypes.shape({
    title: PropTypes.object,
    base: PropTypes.object,
  }).isRequired,
  node: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

const treeDecorators = {
  ...decorators,
  Header: HeaderDecorator,
};

class Stories extends React.Component {
  constructor(...args) {
    super(...args);
    this.onToggle = this.onToggle.bind(this);

    this.state = {
      nodes: this.getSelectedNodes(),
    };
  }

  onToggle(node, toggled) {
    if (node.story) {
      this.fireOnKindAndStory(node.kind, node.story);
    } else if (node.kind) {
      this.fireOnKind(node.kind);
    }

    if (!node.namespaces) {
      return;
    }

    this.setState(prevState => ({
      nodes: {
        ...prevState.nodes,
        [node.namespaces.join(namespaceSeparator)]: toggled,
      },
    }));
  }

  getSelectedNodes() {
    const { selectedHierarchy } = this.props;

    return selectedHierarchy
      .reduce((nodes, namespace) => {
        if (!nodes.length) {
          nodes.push(namespace);
        } else {
          const last = nodes[nodes.length - 1];
          nodes.push(`${last}${namespaceSeparator}${namespace}`);
        }

        return nodes;
      }, [])
      .reduce((nodesMap, node) => ({ ...nodesMap, [node]: true }), {});
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnKindAndStory(kind, story) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, story);
  }

  mapStoriesHierarchy(storiesHierarchy) {
    const treeModel = {
      namespaces: storiesHierarchy.namespaces,
      toggled: this.state.nodes[storiesHierarchy.namespaces.join(namespaceSeparator)],
    };

    if (storiesHierarchy.isNamespace) {
      treeModel.name = storiesHierarchy.current;

      if (storiesHierarchy.map.size > 0) {
        treeModel.children = [];

        storiesHierarchy.map.forEach(childItems => {
          childItems.forEach(item => {
            treeModel.children.push(this.mapStoriesHierarchy(item));
          });
        });
      }
    } else {
      const { selectedStory, selectedKind } = this.props;

      treeModel.name = storiesHierarchy.name;
      treeModel.kind = storiesHierarchy.kind;

      treeModel.children = storiesHierarchy.stories.map(story => ({
        kind: storiesHierarchy.kind,
        story,
        name: story,
        active: selectedStory === story && selectedKind === storiesHierarchy.kind,
      }));
    }

    return treeModel;
  }

  render() {
    const { storiesHierarchy } = this.props;

    const data = this.mapStoriesHierarchy(storiesHierarchy);
    data.toggled = true;
    data.name = 'stories';

    return (
      <Treebeard
        style={treeStyle}
        data={data}
        onToggle={this.onToggle}
        decorators={treeDecorators}
      />
    );
  }
}

Stories.defaultProps = {
  onSelectStory: null,
  storiesHierarchy: null,
};

Stories.propTypes = {
  storiesHierarchy: PropTypes.shape({
    namespaces: PropTypes.arrayOf(PropTypes.string),
    current: PropTypes.string,
    map: PropTypes.object,
  }),
  selectedHierarchy: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedKind: PropTypes.string.isRequired,
  selectedStory: PropTypes.string.isRequired,
  onSelectStory: PropTypes.func,
};

export default Stories;
