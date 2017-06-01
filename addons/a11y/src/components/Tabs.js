import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    width: '100%',
  },
  tabs: {
    borderBottom: '1px solid rgb(234, 234, 234)',
    flexWrap: 'wrap',
    display: 'flex',
  },
  tab: {
    fontFamily: '-apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
    color: 'rgb(68, 68, 68)',
    fontSize: '11px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    padding: '10px 15px',
    letterSpacing: '1px',
    cursor: 'pointer',
    fontWeight: 500,
    opacity: 0.7,
  },
  tabActive: {
    opacity: 1,
    fontWeight: 600,
  }
}

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
    }

    this.onToggle = this.onToggle.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
  }

  onToggle(index) {
    this.setState({
      active: index,
    })
  }

  renderPanel() {
    const { tabs } = this.props;
    const { active } = this.state;

    return (
      <div style={styles.panel}>
        {tabs[active].panel}
      </div>
    )
  }

  renderTabs() {
    const { tabs } = this.props;
    const { active } = this.state;

    return (
      <div style={styles.tabs}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            style={{
              ...styles.tab,
              ...(index === active ? styles.tabActive : undefined)
            }}
            onClick={() => this.onToggle(index)}
          >
            { tab.label }
          </div>
        ))}
      </div>
    )
  }

  render() {
    const { tabs } = this.props;

    return (
      <div style={styles.container}>
        {this.renderTabs()}
        {this.renderPanel()}
      </div>
    );
  }
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node,
    panel: PropTypes.node,
  })),
};

export default Tabs;
