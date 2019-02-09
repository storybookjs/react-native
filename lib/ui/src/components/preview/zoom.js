import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { Icons, IconButton } from '@storybook/components';

const Context = React.createContext();

class Provider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

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

const Zoom = ({ set, reset }) => (
  <Fragment>
    <IconButton key="zoomin" onClick={e => e.preventDefault() || set(0.8)} title="Zoom in">
      <Icons icon="zoom" />
    </IconButton>
    <IconButton key="zoomout" onClick={e => e.preventDefault() || set(1.25)} title="Zoom out">
      <Icons icon="zoomout" />
    </IconButton>
    <IconButton key="zoomreset" onClick={e => e.preventDefault() || reset()} title="Reset zoom">
      <Icons icon="zoomreset" />
    </IconButton>
  </Fragment>
);
Zoom.propTypes = {
  set: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export { Zoom, Consumer as ZoomConsumer, Provider as ZoomProvider };
