import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { baseFonts } from '@storybook/components';

const styles = {
  container: {
    width: '100%',
    ...baseFonts,
  },
  tabs: {
    borderBottom: '1px solid rgb(234, 234, 234)',
    flexWrap: 'wrap',
    display: 'flex',
  },
  tab: {
    color: 'rgb(68, 68, 68)',
    fontSize: '11px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    padding: '10px 15px',
    letterSpacing: '1px',
    cursor: 'pointer',
    fontWeight: 500,
    opacity: 0.7,
    border: 'none',
    background: 'none',
    flex: 1,
  },
  tabActive: {
    opacity: 1,
    fontWeight: 600,
  },
};

const tabStyle = active => ({
  ...styles.tab,
  ...(active ? styles.tabActive : undefined),
});

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
    };

    this.onToggle = this.onToggle.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
  }

  onToggle(index) {
    this.setState({
      active: index,
    });
  }

  renderPanel() {
    const { tabs } = this.props;
    const { active } = this.state;

    return <div style={styles.panel}>{tabs[active].panel}</div>;
  }

  renderTabs() {
    const { tabs } = this.props;
    const { active } = this.state;

    /* eslint-disable react/no-array-index-key */
    return (
      <div style={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            style={tabStyle(active === index)}
            onClick={() => this.onToggle(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div style={styles.container}>
        {this.renderTabs()}
        {this.renderPanel()}
      </div>
    );
  }
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      panel: PropTypes.node,
    })
  ).isRequired,
};

export default Tabs;
