import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Tab, TabBar } from '../tabs/tabs';

const MobilePanel = styled.div(({ selected, theme }) =>
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
        ...theme.storiesNav,
      }
    : {
        display: 'none',
      }
);
const TabsWrapper = styled.div({
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
    const { children } = this.props;

    return (
      <div>
        <TabsWrapper>
          <TabBar>
            {children.map((item, i) => (
              <Tab
                key={MobileTabs[i]}
                name={MobileTabs[i]}
                active={i === index}
                title={MobileTabs[i] || `${i}`}
                onSelect={() => this.setState({ index: i })}
              />
            ))}
          </TabBar>
        </TabsWrapper>
        {Children.toArray(children).map((item, i) => (
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
