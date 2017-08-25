import { Treebeard } from 'react-treebeard';
import PropTypes from 'prop-types';
import React from 'react';
import deepEqual from 'deep-equal';
import treeNodeTypes from './tree_node_type';
import treeDecorators from './tree_decorators';
import treeStyle from './tree_style';

const namespaceSeparator = '@';

function createNodeKey({ namespaces, type }) {
  return [...namespaces, [type]].join(namespaceSeparator);
}

function getSelectedNodes(selectedHierarchy) {
  return selectedHierarchy
    .reduce((nodes, namespace, index) => {
      const node = {};

      node.type =
        selectedHierarchy.length - 1 === index ? treeNodeTypes.COMPONENT : treeNodeTypes.NAMESPACE;

      if (!nodes.length) {
        node.namespaces = [namespace];
      } else {
        const lastNode = nodes[nodes.length - 1];
        node.namespaces = [...lastNode.namespaces, [namespace]];
      }

      nodes.push(node);

      return nodes;
    }, [])
    .reduce((nodesMap, node) => ({ ...nodesMap, [createNodeKey(node)]: true }), {});
}

class Stories extends React.Component {
  constructor(...args) {
    super(...args);
    this.onToggle = this.onToggle.bind(this);

    const { selectedHierarchy } = this.props;

    this.state = {
      overriddenFilteredNodes: {},
      nodes: getSelectedNodes(selectedHierarchy),
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      selectedHierarchy: nextSelectedHierarchy = [],
      storyFilter: nextStoryFilter,
    } = nextProps;

    const {
      selectedHierarchy: currentSelectedHierarchy = [],
      storyFilter: currentStoryFilter,
    } = this.props;

    const shouldClearFilteredNodes = nextStoryFilter !== currentStoryFilter;
    const selectedHierarchyChanged = !deepEqual(nextSelectedHierarchy, currentSelectedHierarchy);

    if (selectedHierarchyChanged || shouldClearFilteredNodes) {
      const selectedNodes = getSelectedNodes(nextSelectedHierarchy);

      this.setState(prevState => ({
        overriddenFilteredNodes: shouldClearFilteredNodes ? {} : prevState.overriddenFilteredNodes,
        nodes: {
          ...prevState.nodes,
          ...selectedNodes,
        },
      }));
    }
  }

  onToggle(node, toggled) {
    if (node.story) {
      this.fireOnKindAndStory(node.kind, node.story);
    } else if (node.kind && toggled) {
      this.fireOnKind(node.kind);
    }

    if (!node.namespaces) {
      return;
    }

    this.setState(prevState => ({
      nodes: {
        ...prevState.nodes,
        [node.key]: toggled,
      },
      overriddenFilteredNodes: {
        ...prevState.overriddenFilteredNodes,
        [node.key]: !toggled,
      },
    }));
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
      name: storiesHierarchy.name,
      highlight: storiesHierarchy.highlight,
    };

    if (storiesHierarchy.isNamespace) {
      treeModel.type = treeNodeTypes.NAMESPACE;

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

      treeModel.kind = storiesHierarchy.kind;
      treeModel.type = treeNodeTypes.COMPONENT;

      treeModel.children = storiesHierarchy.stories.map(story => ({
        name: story.name,
        story: story.name,
        kind: storiesHierarchy.kind,
        active: selectedStory === story.name && selectedKind === storiesHierarchy.kind,
        type: treeNodeTypes.STORY,
        highlight: story.highlight,
      }));
    }

    treeModel.key = createNodeKey(treeModel);
    treeModel.toggled = this.isToggled(treeModel);

    return treeModel;
  }

  isToggled(treeModel) {
    return this.state.nodes[treeModel.key] || this.isFilteredNode(treeModel.key);
  }

  isFilteredNode(key) {
    if (!this.props.storyFilter) {
      return false;
    }

    return !this.state.overriddenFilteredNodes[key];
  }

  render() {
    const { storiesHierarchy, sidebarAnimations } = this.props;

    const data = this.mapStoriesHierarchy(storiesHierarchy);
    data.toggled = true;
    data.root = true;

    return (
      <Treebeard
        style={treeStyle}
        data={data}
        onToggle={this.onToggle}
        animations={sidebarAnimations ? undefined : false}
        decorators={treeDecorators}
      />
    );
  }
}

Stories.defaultProps = {
  onSelectStory: null,
  storiesHierarchy: null,
  storyFilter: null,
  sidebarAnimations: true,
};

Stories.propTypes = {
  storyFilter: PropTypes.string,
  storiesHierarchy: PropTypes.shape({
    namespaces: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    map: PropTypes.object,
  }),
  selectedHierarchy: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedKind: PropTypes.string.isRequired,
  selectedStory: PropTypes.string.isRequired,
  onSelectStory: PropTypes.func,
  sidebarAnimations: PropTypes.bool,
};

export default Stories;
