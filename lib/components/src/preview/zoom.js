import React, { Component } from 'react';

const Context = React.createContext();

class Provider extends Component {
  state = {
    value: 1,
  };

  set = value => this.setState({ value });

  render() {
    const { children } = this.props;
    const { set } = this;
    const { value } = this.state;

    return <Context.Provider value={{ value, set }}>{children}</Context.Provider>;
  }
}

const { Consumer } = Context;

export { Consumer as ZoomConsumer, Provider as ZoomProvider };
