import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'react-emotion';

import { Placeholder, TabsState } from '@storybook/components';

const Wrapper = styled('div')({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  borderRadius: 4,
  border: 'solid 1px rgb(236, 236, 236)',
  width: '100%',
});

const Bar = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderBottom: 'solid 1px #eaeaea',
});

const Content = styled('div')({
  flex: '1 1 0',
  display: 'flex',
  overflow: 'auto',
});

const Tab = styled('button')(({ active }) => ({
  fontSize: 11,
  letterSpacing: '1px',
  padding: '10px 15px',
  textTransform: 'uppercase',
  transition: 'opacity 0.3s',
  opacity: active ? 1 : 0.5,
  maxHeight: 60,
  overflow: 'hidden',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',

  '&:empty': {
    display: 'none',
  },
}));

class GroupTabs extends Component {
  renderTab(name, group) {
    const onClick = e => {
      e.preventDefault();
      this.props.onGroupSelect(name);
    };

    let { title } = group;
    if (typeof title === 'function') {
      title = title();
    }

    return (
      <Tab
        type="button"
        key={name}
        onClick={onClick}
        role="tab"
        active={this.props.selectedGroup === name}
      >
        {title}
      </Tab>
    );
  }

  render() {
    const entries = this.props.groups ? Object.entries(this.props.groups) : null;

    return <TabsState panels={this.props.groups} />;

    return entries && entries.length ? (
      <Wrapper>
        <Bar role="tablist">{entries.map(([key, value]) => this.renderTab(key, value))}</Bar>
        <Content>
          {entries.map(([key, value]) => {
            const groupStyle = { display: 'none' };
            if (key === this.props.selectedGroup) {
              Object.assign(groupStyle, { flex: 1, display: 'flex' });
            }
            return (
              <div key={key} style={groupStyle}>
                {value.render()}
              </div>
            );
          })}
        </Content>
      </Wrapper>
    ) : (
      <Placeholder>no groups available</Placeholder>
    );
  }
}

GroupTabs.defaultProps = {
  groups: {},
  onGroupSelect: () => {},
  selectedGroup: null,
};

GroupTabs.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  groups: PropTypes.object,
  onGroupSelect: PropTypes.func,
  selectedGroup: PropTypes.string,
};

export default GroupTabs;
