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
          height: 'calc(100vh - 34px)',
          width: '100vw',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }
      : {
          display: 'none',
        }
);
const TabsWrapper = glamorous.div({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100vw',
  zIndex: 9999,
});

const MobileTabs = ['Navigator', 'Preview', 'Addons'];

export default class Layout extends Component {
  state = { index: 1 };
  render() {
    const { index } = this.state;
    const children = Children.toArray(this.props.children);

    return (
      <div>
        <TabsWrapper>
          <TabBar>
            {children.map((item, i) => (
              <Tab
                key={MobileTabs[i]}
                name={MobileTabs[i]}
                selected={i === index}
                title={MobileTabs[i] || `${i}`}
                onSelect={() => this.setState({ index: i })}
              />
            ))}
          </TabBar>
        </TabsWrapper>
        {children.map((item, i) => (
          <MobilePanel key={MobileTabs[i]} selected={i === index}>
            {item}
          </MobilePanel>
        ))}
      </div>
    );
  }
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
