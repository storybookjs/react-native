import React from 'react';
import PropTypes from 'prop-types';

const ctx = React.createContext();

export class Provider extends React.Component {
  static propTypes = {
    manager: PropTypes.shape().isRequired,
    children: PropTypes.node.isRequired,
  };

  componentDidMount() {
    const { manager } = this.props;
    this.unsubscribe = manager.store.subscribe(() => {
      this.setState({});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { manager, children } = this.props;
    return (
      <ctx.Provider
        value={{
          state: manager.store.getState(),
          manager,
        }}
      >
        {children}
      </ctx.Provider>
    );
  }
}

export const { Consumer } = ctx;
