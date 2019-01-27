import React, { Component } from 'react';

const Context = React.createContext();

class Provider extends Component {
  state = {
    value: 'transparent',
    grid: false,
  };

  setValue = value => this.setState({ value });

  setGrid = grid => this.setState({ grid });

  render() {
    const { children } = this.props;
    const { setValue, setGrid } = this;
    const { value, grid } = this.state;

    return (
      <Context.Provider value={{ value, setValue, grid, setGrid }}>{children}</Context.Provider>
    );
  }
}

const { Consumer } = Context;

export { Consumer as BackgroundConsumer, Provider as BackgroundProvider };
