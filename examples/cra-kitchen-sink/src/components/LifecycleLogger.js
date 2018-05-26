import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import { logger } from '@storybook/client-logger';

function log(name) {
  logger.info(`LifecycleLogger: ${name}`);
}

// A component that logs its lifecycle so we can check that things happen
// the right number of times (i.e. we are using React properly)
class LifecycleLogger extends Component {
  constructor() {
    super();
    log('constructor');
    this.state = {};
  }
  componentDidMount() {
    log('componentDidMount');
  }
  getSnapshotBeforeUpdate() {
    log('getSnapshotBeforeUpdate');
  }
  componentDidUpdate() {
    log('componentDidUpdate');
  }
  componentDidCatch() {
    log('componentDidCatch');
  }
  componentWillUnmount() {
    log('componentWillUnmount');
  }
  render() {
    log('render');
    return <div>Lifecycle methods are logged to the console</div>;
  }
}

LifecycleLogger.getDerivedStateFromProps = () => {
  log('getDerivedStateFromProps');
  return null;
};

polyfill(LifecycleLogger);

export default LifecycleLogger;
