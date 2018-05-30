import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

const Container = styled('div')({
  width: '100%',
  position: 'relative',
  minHeight: '100%',
});

const List = styled('div')(({ theme }) => ({
  borderBottom: theme.mainBorder,
  flexWrap: 'wrap',
  display: 'flex',
}));

const Item = styled('button')(
  ({ active }) =>
    active
      ? {
          opacity: 1,
          fontWeight: 600,
        }
      : {},
  ({ theme }) => ({
    textDecoration: 'none',
    textTransform: 'uppercase',
    padding: '10px 15px',
    letterSpacing: '1px',
    cursor: 'pointer',
    fontWeight: 500,
    opacity: 0.7,
    border: 'none',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',
    background: 'none',
    flex: 1,

    '&:focus': {
      outline: '0 none',
      borderBottom: `3px solid ${theme.highlightColor}`,
    },
  })
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
