import PropTypes from 'prop-types';
import React, { Component } from 'react';
import style from './style';

class AddonPanel extends Component {
  renderTab(name, panel) {
    let tabStyle = style.tablink;
    if (this.props.selectedPanel === name) {
      tabStyle = Object.assign({}, style.tablink, style.activetab);
    }

    const onClick = () => e => {
      e.preventDefault();
      this.props.onPanelSelect(name);
    };

    let title = panel.title;
    if (typeof title === 'function') {
      title = title();
    }

    return (
      <a key={name} style={tabStyle} onClick={onClick()} role="tab" tabIndex="0">
        {title}
      </a>
    );
  }

  renderTabs() {
    return Object.keys(this.props.panels).map(name => {
      const panel = this.props.panels[name];
      return this.renderTab(name, panel);
    });
  }

  renderPanels() {
    return Object.keys(this.props.panels).sort().map(name => {
      const panelStyle = { display: 'none' };
      const panel = this.props.panels[name];
      if (name === this.props.selectedPanel) {
        Object.assign(panelStyle, { flex: 1, display: 'flex' });
      }
      return (
        <div key={name} style={panelStyle} role="tabpanel">
          {panel.render()}
        </div>
      );
    });
  }

  renderEmpty() {
    return <div style={style.empty}>no panels available</div>;
  }

  render() {
    if (!this.props.panels || !Object.keys(this.props.panels).length) {
      return this.renderEmpty();
    }
    return (
      <div style={style.wrapper}>
        <div style={style.tabbar} role="tablist">
          {this.renderTabs()}
        </div>
        <div style={style.content}>
          {this.renderPanels()}
        </div>
      </div>
    );
  }
}

AddonPanel.defaultProps = {
  panels: {},
  onPanelSelect: () => {},
  selectedPanel: null,
};

AddonPanel.propTypes = {
  panels: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onPanelSelect: PropTypes.func,
  selectedPanel: PropTypes.string,
};

export default AddonPanel;
