import React, { Component } from 'react';
import style from './style';

class DownPanel extends Component {
  renderTab(name, panel) {
    let tabStyle = style.tablink;
    if (this.props.selectedPanel === name) {
      tabStyle = Object.assign({}, style.tablink, style.activetab);
    }

    const onClick = () => {
      return e => {
        e.preventDefault();
        this.props.onPanelSelect(name);
      };
    };

    return (
      <a
        href="#"
        key={name}
        style={tabStyle}
        onClick={onClick()}
      >
        {panel.title}
      </a>
    );
  }

  renderTabs() {
    return Object.keys(this.props.panels).map(name => {
      const panel = this.props.panels[name];
      return this.renderTab(name, panel);
    });
  }

  renderPanel() {
    const panelStyle = { flex: 1, display: 'flex' };
    const panel = this.props.panels[this.props.selectedPanel];
    return <div key={name} style={panelStyle}>{panel.render()}</div>;
  }

  renderEmpty() {
    return (
      <div style={style.empty}>
        no panels available
      </div>
    );
  }

  render() {
    if (!this.props.panels || !Object.keys(this.props.panels).length) {
      return this.renderEmpty();
    }
    return (
      <div style={style.wrapper}>
        <div style={style.tabbar}>{this.renderTabs()}</div>
        <div style={style.content}>{this.renderPanel()}</div>
      </div>
    );
  }
}

DownPanel.propTypes = {
  panels: React.PropTypes.object,
  onPanelSelect: React.PropTypes.func,
  selectedPanel: React.PropTypes.string,
};

export default DownPanel;
