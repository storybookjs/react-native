import { Treebeard, decorators } from 'react-treebeard';
import PropTypes from 'prop-types';
import React from 'react';
import { isSelectedHierarchy } from '../../libs/hierarchy';
import { baseFonts } from '../theme';

const hierarchySeparatorColor = '#CCC';
const hierarchySeparatorOffset = '15px';

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
          margin: '-7px 0 0 -7px',
          height: '14px',
        },
        height: 14,
        width: 14,
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

// const listStyle = {
//   ...baseFonts,
// };

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
    this.onToggle = this.onToggle.bind(this);

    this.state = {
      nodes: {},
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

    const { selectedHierarchy } = this.props;
    let theRealToggle = toggled;

    if (!toggled && isSelectedHierarchy(node.namespaces, selectedHierarchy)) {
      theRealToggle = true;
    }

    this.setState(prevState => ({
      nodes: {
        ...prevState.nodes,
        [node.namespaces.join('@')]: theRealToggle,
      },
    }));
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnStory(story) {
    const { onSelectStory, selectedKind } = this.props;
    if (onSelectStory) onSelectStory(selectedKind, story);
  }

  fireOnKindAndStory(kind, story) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, story);
  }

  createData(oldData) {
    const { selectedStory, selectedKind, selectedHierarchy } = this.props;

    const newData = {
      namespaces: oldData.namespaces,
    };

    if (oldData.isNamespace) {
      newData.name = oldData.current || 'stories';

      if (oldData.map.size > 0) {
        newData.children = [];
        newData.toggled =
          this.state.nodes[newData.namespaces.join('@')] ||
          isSelectedHierarchy(newData.namespaces, selectedHierarchy);

        oldData.map.forEach(childItems => {
          childItems.forEach(item => {
            newData.children.push(this.createData(item));
          });
        });
      }
    } else {
      newData.name = oldData.name;
      newData.kind = oldData.kind;
      newData.toggled =
        this.state.nodes[newData.namespaces.join('@')] ||
        isSelectedHierarchy(newData.namespaces, selectedHierarchy);

      newData.children = oldData.stories.map(story => ({
        kind: oldData.kind,
        story,
        name: story,
        active: selectedStory === story && selectedKind === oldData.kind,
      }));
    }

    return newData;
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

    const data = this.createData(storiesHierarchy);
    data.toggled = true;

    // return (
    //   <div style={listStyle}>
    //     {this.renderHierarchy(storiesHierarchy)}
    //   </div>
    // );

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
