import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '../theme';

const hierarchySeparatorColor = '#CCC';
const hierarchySeparatorOffset = '15px';

const baseListItemStyle = {
  display: 'block',
  cursor: 'pointer',
};

const kindStyle = {
  ...baseListItemStyle,
  fontSize: 15,
  padding: '5px 0px',
};

const nameSpaceStyle = {
  ...kindStyle,
  color: '#8aa4d1',
};

const storyStyle = {
  ...baseListItemStyle,
  fontSize: 13,
  padding: '5px 0px',
};

const listStyle = {
  ...baseFonts,
};

const listStyleType = {
  listStyleType: 'none',
  paddingLeft: 0,
  margin: 0,
};

const nestedListStyle = {
  ...listStyleType,
  paddingLeft: hierarchySeparatorOffset,
  borderLeft: `1px solid ${hierarchySeparatorColor}`,
};

const separatorStyle = {
  margin: 0,
  padding: 0,
  width: '5px',
  position: 'absolute',
  left: `-${hierarchySeparatorOffset}`,
  top: '50%',
  border: 'none',
  borderTop: `1px solid ${hierarchySeparatorColor}`,
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
      const namespace = namespaces[0];
      const childItems = hierarchy.map.get(namespace) || [];

      childItems.push(story);
      hierarchy.map.set(namespace, childItems);
      return;
    }

    const namespace = namespaces[0];
    const childItems = hierarchy.map.get(namespace) || [];
    let childHierarchy = childItems.find(item => item.isNamespace);

    if (!childHierarchy) {
      childHierarchy = {
        isNamespace: true,
        current: namespace,
        namespace: hierarchy.namespace ? `${hierarchy.namespace}${namespace}.` : `${namespace}.`,
        firstKind: story.kind,
        map: new Map(),
      };

      childItems.push(childHierarchy);
      hierarchy.map.set(namespace, childItems);
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

  renderMenuListItem(item, style, onClick, displayName) {
    const listItemStyle = { position: 'relative' };

    return (
      <li key={item} style={listItemStyle}>
        <hr style={separatorStyle} />
        {this.renderMenuItem(item, style, onClick, displayName)}
      </li>
    );
  }

  renderStory(story) {
    const { selectedStory } = this.props;
    const style = { ...storyStyle };
    const props = {
      onClick: this.fireOnStory.bind(this, story),
    };

    if (story === selectedStory) {
      style.fontWeight = 'bold';
    }

    return this.renderMenuListItem(story, style, props.onClick, story);
  }

  renderKind({ kind, stories, name }) {
    const { selectedKind } = this.props;
    const storyKindStyle = { ...kindStyle };
    const onClick = this.fireOnKind.bind(this, kind);
    const displayName = name || kind;

    const children = [this.renderMenuListItem(kind, storyKindStyle, onClick, displayName)];

    if (kind === selectedKind) {
      storyKindStyle.fontWeight = 'bold';

      children.push(
        <li key={`${kind}_stories`}>
          <ul style={nestedListStyle} role="menu">
            {stories.map(this.renderStory)}
          </ul>
        </li>
      );
    }

    return children;
  }

  renderHierarchy({ map }) {
    const { selectedKind } = this.props;
    const children = [];

    map.forEach((childItems, key) => {
      childItems.forEach(value => {
        const style = { ...nameSpaceStyle };
        const onClick = this.fireOnKind.bind(this, value.firstKind);
        const isSelectedHierarchy = selectedKind.indexOf(value.namespace) >= 0;

        if (isSelectedHierarchy) {
          style.fontWeight = 'bold';
        }

        if (value.isNamespace) {
          children.push(
            <ul style={listStyleType} role="menu" key={`${value.current}_container`}>
              {this.renderMenuListItem(value.current, style, onClick, key)}
              {isSelectedHierarchy &&
                <li key={`${value.current}_children`} style={nestedListStyle}>
                  {this.renderHierarchy(value)}
                </li>}
            </ul>
          );
        } else {
          children.push(
            <ul style={listStyleType} role="menu" key={`${value.kind}_menu`}>
              {this.renderKind(value)}
            </ul>
          );
        }
      });
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
