import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

const Context = React.createContext();

class Provider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    grid: false,
    value: 'transparent',
  };

  setValue = value => this.setState({ value });

  setGrid = grid => this.setState({ grid });

  render() {
    const { setValue, setGrid } = this;
    const { children } = this.props;
    const { value, grid } = this.state;

    return (
      <Context.Provider value={{ value, setValue, grid, setGrid }}>{children}</Context.Provider>
    );
  }
}

const { Consumer } = Context;

const defaults = {
  grid: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='smallGrid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='gray' stroke-width='0.5'/%3E%3C/pattern%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Crect width='100' height='100' fill='url(%23smallGrid)'/%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='gray' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
    backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
    backgroundPosition: '-2px -2px',
    mixBlendMode: 'difference',
  },
};

const Grid = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  defaults.grid
);

const Background = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'background .1s linear',
  },
  ({ theme }) => ({ background: theme.background.content })
);

export { Grid, Background, Consumer as BackgroundConsumer, Provider as BackgroundProvider };
