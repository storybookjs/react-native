import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '../theme';
import { isSelectedHierarchy } from '../../libs/hierarchy';

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
    const { selectedHierarchy } = this.props;
    const children = [];

    map.forEach((childItems, key) => {
      childItems.forEach(value => {
        const style = { ...nameSpaceStyle };
        const onClick = this.fireOnKind.bind(this, value.firstKind);
        const isSelected = isSelectedHierarchy(value.namespaces, selectedHierarchy);

        if (isSelected) {
          style.fontWeight = 'bold';
        }

        if (value.isNamespace) {
          children.push(
            <ul style={listStyleType} role="menu" key={`${value.current}_container`}>
              {this.renderMenuListItem(value.current, style, onClick, key)}
              {isSelected &&
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
    const { storiesHierarchy } = this.props;

    return (
      <div style={listStyle}>
        {this.renderHierarchy(storiesHierarchy)}
      </div>
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
