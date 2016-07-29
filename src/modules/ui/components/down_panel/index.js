import React, { Component } from 'react';
import style from './style';

class DownPanel extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {current: Object.keys(props.addons)[0]};
  }

  showAddon(name) {
    this.setState({current: name})
  }

  renderTab(name, addon) {
    let tabStyle = style.tablink;
    if (this.state.current === name) {
      tabStyle = Object.assign({}, style.tablink, style.activetab);
    }
    const onClick = name => {
      return e => {
        e.preventDefault();
        this.showAddon(name);
      };
    }

    return (
      <a
        href="#"
        key={name}
        style={tabStyle}
        onClick={onClick(name)}>
        {addon.title}
      </a>
    )
  }

  renderTabs() {
    return Object.keys(this.props.addons).map(name => {
      const addon = this.props.addons[name];
      return this.renderTab(name, addon);
    });
  }

  renderAddons() {
    return Object.keys(this.props.addons).sort().map(name => {
      const panelStyle = {display: 'none'};
      const addon = this.props.addons[name];
      if (name === this.state.current) {
        Object.assign(panelStyle, {flex: 1, display: 'flex'});
      }
      return <div key={name} style={panelStyle}>{addon.getPanel()}</div>;
    });
  }

  renderEmpty() {
    return (
      <div style={style.empty}>
        no addons available
      </div>
    );
  }

  render() {
    if (!this.props.addons || !Object.keys(this.props.addons).length) {
      return this.renderEmpty();
    }
    return (
      <div style={style.wrapper}>
        <div style={style.tabbar}>{this.renderTabs()}</div>
        <div style={style.content}>{this.renderAddons()}</div>
      </div>
    );
  }
}

export default DownPanel;
