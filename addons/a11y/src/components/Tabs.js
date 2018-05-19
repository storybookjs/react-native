import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

const Container = styled('div')({
  width: '100%',
  position: 'relative',
});

const List = styled('div')({
  borderBottom: '1px solid rgb(234, 234, 234)',
  flexWrap: 'wrap',
  display: 'flex',
});

const Item = styled('button')(
  ({ active }) =>
    active
      ? {
          opacity: 1,
          fontWeight: 600,
        }
      : {},
  {
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
  }
);

class Tabs extends Component {
  state = {
    active: 0,
  };

  onToggle = index => {
    this.setState({
      active: index,
    });
  };

  render() {
    const { tabs } = this.props;
    const { active } = this.state;

    return (
      <Container>
        <List>
          {tabs.map((tab, index) => (
            <Item
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              active={active === index ? true : undefined}
              onClick={() => this.onToggle(index)}
            >
              {tab.label}
            </Item>
          ))}
        </List>
        <div>{tabs[active].panel}</div>
      </Container>
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
