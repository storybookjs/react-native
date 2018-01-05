import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { baseFonts } from '@storybook/components';

const styles = {
  empty: {
    flex: 1,
    display: 'flex',
    ...baseFonts,
    fontSize: 11,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wrapper: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    borderRadius: 4,
    border: 'solid 1px rgb(236, 236, 236)',
    marginTop: 5,
    width: '100%',
  },

  tabbar: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottom: 'solid 1px #eaeaea',
  },

  content: {
    flex: '1 1 0',
    display: 'flex',
    overflow: 'auto',
  },

  tablink: {
    ...baseFonts,
    fontSize: 11,
    letterSpacing: '1px',
    padding: '10px 15px',
    textTransform: 'uppercase',
    transition: 'opacity 0.3s',
    opacity: 0.5,
    maxHeight: 60,
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
  },

  activetab: {
    opacity: 1,
  },
};

class GroupTabs extends Component {
  renderTab(name, group) {
    let tabStyle = styles.tablink;
    if (this.props.selectedGroup === name) {
      tabStyle = Object.assign({}, styles.tablink, styles.activetab);
    }

    const onClick = e => {
      e.preventDefault();
      this.props.onGroupSelect(name);
    };

    let { title } = group;
    if (typeof title === 'function') {
      title = title();
    }

    return (
      <button type="button" key={name} style={tabStyle} onClick={onClick} role="tab">
        {title}
      </button>
    );
  }

  renderTabs() {
    return Object.keys(this.props.groups).map(name => {
      const group = this.props.groups[name];
      return this.renderTab(name, group);
    });
  }

  renderGroups() {
    return Object.keys(this.props.groups)
      .sort()
      .map(name => {
        const groupStyle = { display: 'none' };
        const group = this.props.groups[name];
        if (name === this.props.selectedGroup) {
          Object.assign(groupStyle, { flex: 1, display: 'flex' });
        }
        return (
          <div key={name} style={groupStyle}>
            {group.render()}
          </div>
        );
      });
  }

  renderEmpty() {
    return <div style={styles.empty}>no groups available</div>;
  }

  render() {
    if (!this.props.groups || !Object.keys(this.props.groups).length) {
      return this.renderEmpty();
    }
    return (
      <div style={styles.wrapper}>
        <div style={styles.tabbar} role="tablist">
          {this.renderTabs()}
        </div>
        <div style={styles.content}>{this.renderGroups()}</div>
      </div>
    );
  }
}

GroupTabs.defaultProps = {
  groups: {},
  onGroupSelect: () => {},
  selectedGroup: null,
};

GroupTabs.propTypes = {
  groups: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onGroupSelect: PropTypes.func,
  selectedGroup: PropTypes.string,
};

export default GroupTabs;
