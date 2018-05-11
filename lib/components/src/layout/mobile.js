import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import { TabBar, Tab } from '../addon_panel/index';

const MobilePanel = glamorous.div(
  ({ selected }) =>
    selected
      ? {
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          height: 'calc(100vh - 40px)',
          width: '100vw',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }
      : {
          display: 'none',
        }
);

const MobileTabs = ['Navigator', 'Preview', 'Addons'];

export default class Layout extends Component {
  state = { index: 1 };
  render() {
    const { index } = this.state;
    const children = Children.toArray(this.props.children);

    return (
      <div>
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100vw',
            zIndex: 9999,
          }}
        >
          <TabBar>
            {children.map((item, i) => (
              <Tab
                key={MobileTabs[i]}
                name={i}
                selected={i === index}
                title={MobileTabs[i] || `${i}`}
                onSelect={() => this.setState({ index: i })}
              />
            ))}
          </TabBar>
        </div>
        {children.map((item, i) => <MobilePanel selected={i === index}>{item}</MobilePanel>)}
      </div>
    );
  }
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
