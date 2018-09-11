import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Icons from '../icons/util/index';
import { IconButton } from './toolbar';

const Container = styled.div({
  position: 'relative',
});

class Toggleable extends Component {
  state = {
    active: false,
  };

  render() {
    const { active } = this.state;
    const { children } = this.props;

    return children({ active, toggle: () => this.setState({ active: !active }) });
  }
}
Toggleable.propTypes = {
  children: PropTypes.func.isRequired,
};

const List = styled.div(
  {
    position: 'absolute',
    right: 0,
    top: '100%',
    width: 220,
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  ({ theme }) => ({ background: theme.barFill })
);
const Item = styled.button(
  {
    height: 40,
    boxSizing: 'border-box',
    lineHeight: '16px',
    padding: 12,
    margin: 0,
    display: 'block',
    cursor: 'pointer',
    textDecoration: 'none',
    border: '0 none',
    background: 'transparent',
    width: 'auto',
    textAlign: 'left',
  },
  ({ theme }) => ({
    fontSize: theme.mainTextSize,
    fontFamily: theme.mainTextFace,
    color: theme.mainTextColor,
    transition: 'all .05s linear',
    borderLeft: `0px solid ${theme.highlightColor}`,
    '&:hover, &:focus': {
      color: theme.highlightColor,
      borderLeft: `3px solid ${theme.highlightColor}`,
    },
  })
);

const Menu = ({ actions }) => (
  <Toggleable>
    {({ toggle, active }) => (
      <Container>
        <IconButton onClick={toggle}>
          <Icons.Menu />
        </IconButton>
        {active ? (
          <List>
            {Object.entries(actions).map(([text, onClick]) => (
              <Item
                key={text}
                onClick={() => {
                  toggle();
                  onClick();
                }}
              >
                {text}
              </Item>
            ))}
          </List>
        ) : null}
      </Container>
    )}
  </Toggleable>
);
Menu.propTypes = {
  actions: PropTypes.shape({}).isRequired,
};

export { Menu as default };
