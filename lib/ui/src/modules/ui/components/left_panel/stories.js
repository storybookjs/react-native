import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '../theme';

const listStyle = {
  ...baseFonts,
};

const listStyleType = {
  listStyleType: 'none',
  paddingLeft: 0,
  margin: 0,
};

const kindStyle = {
  fontSize: 15,
  padding: '10px 0px',
  cursor: 'pointer',
};

const nestedListStyle = {
  paddingLeft: '10px',
  borderLeft: '1px solid #BBB',
};

const storyStyle = {
  fontSize: 13,
  padding: '8px 0px 8px 10px',
  cursor: 'pointer',
};

class Stories extends React.Component {
  constructor(...args) {
    super(...args);
    this.renderKind = this.renderKind.bind(this);
    this.renderStory = this.renderStory.bind(this);
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnStory(story) {
    const { onSelectStory, selectedKind } = this.props;
    if (onSelectStory) onSelectStory(selectedKind, story);
  }

  fillHierarchy(namespaces, hierarchy, story) {
    if (namespaces.length === 1) {
      hierarchy.stories.push(story);
      return;
    }

    const namespace = namespaces[0];
    let childHierarchy = hierarchy.map.get(namespace);

    if (!childHierarchy) {
      childHierarchy = {
        stories: [],
        current: namespace,
        namespace: hierarchy.namespace ? `${hierarchy.namespace}${namespace}.` : `${namespace}.`,
        firstKind: story.kind,
        map: new Map(),
      };

      hierarchy.map.set(namespace, childHierarchy);
    }

    this.fillHierarchy(namespaces.slice(1), childHierarchy, story);
  }

  createStoriesHierarchy(stories) {
    const groupedStories = stories.map(story => {
      const namespaces = story.kind.split('.');

      return {
        namespaces,
        name: namespaces[namespaces.length - 1],
        ...story,
      };
    });

    const hierarchyRoot = {
      stories: [],
      namespace: '',
      current: '',
      map: new Map(),
    };

    groupedStories.forEach(story => this.fillHierarchy(story.namespaces, hierarchyRoot, story));

    return hierarchyRoot;
  }

  renderMenuItem(item, style, onClick, displayName) {
    return (
      <a title={`Open ${item}`} style={style} onClick={onClick} role="menuitem" tabIndex="0">
        {displayName}
      </a>
    );
  }

  renderStory(story) {
    const { selectedStory } = this.props;
    const style = { display: 'block', ...storyStyle };
    const props = {
      onClick: this.fireOnStory.bind(this, story),
    };

    if (story === selectedStory) {
      style.fontWeight = 'bold';
    }

    return (
      <li key={story}>
        {this.renderMenuItem(story, style, props.onClick, story)}
      </li>
    );
  }

  renderKind({ kind, stories, name }) {
    const { selectedKind } = this.props;
    const style = { display: 'block', ...kindStyle };
    const onClick = this.fireOnKind.bind(this, kind);
    const displayName = name || kind;

    if (kind === selectedKind) {
      style.fontWeight = 'bold';
      return (
        <li key={kind}>
          {this.renderMenuItem(kind, style, onClick, displayName)}
          <div>
            <ul style={listStyleType} role="menu">
              {stories.map(this.renderStory)}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={kind}>
        {this.renderMenuItem(kind, style, onClick, displayName)}
      </li>
    );
  }

  renderHierarchy({ stories, namespace, map }) {
    const { selectedKind } = this.props;
    const children = [];

    if (stories.length) {
      children.push(
        <ul style={listStyleType} role="menu" key={namespace ? `${namespace}menu` : ''}>
          {stories.map(this.renderKind)}
        </ul>
      );
    }

    map.forEach((value, key) => {
      const style = { display: 'block', ...kindStyle };
      const onClick = this.fireOnKind.bind(this, value.firstKind);
      const isSelectedHierarchy = selectedKind.indexOf(value.namespace) >= 0;

      if (isSelectedHierarchy) {
        style.fontWeight = 'bold';
      }

      children.push(
        <ul style={listStyleType} role="menu" key={`${value.current}_container`}>
          <li key={value.current}>
            {this.renderMenuItem(key, style, onClick, key)}
          </li>
          {isSelectedHierarchy &&
            <li key={`${value.current}_children`} style={nestedListStyle}>
              {this.renderHierarchy(value)}
            </li>}
        </ul>
      );
    });

    return children;
  }

  render() {
    const { stories, leftPanelHierarchy } = this.props;

    if (leftPanelHierarchy) {
      const hierarchy = this.createStoriesHierarchy(stories);

      return (
        <div style={listStyle}>
          {this.renderHierarchy(hierarchy)}
        </div>
      );
    }

    return (
      <div style={listStyle}>
        <ul style={listStyleType} role="menu">
          {stories.map(this.renderKind)}
        </ul>
      </div>
    );
  }
}

Stories.defaultProps = {
  stories: [],
  onSelectStory: null,
};

Stories.propTypes = {
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      kind: PropTypes.string,
      stories: PropTypes.array,
    })
  ),
  selectedKind: PropTypes.string.isRequired,
  selectedStory: PropTypes.string.isRequired,
  leftPanelHierarchy: PropTypes.bool.isRequired,
  onSelectStory: PropTypes.func,
};

export default Stories;
