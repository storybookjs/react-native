import React, { Component } from 'react';
import { logger } from '@storybook/client-logger';

function log(name) {
  logger.info(`LifecycleLogger: ${name}`);
}

// A component that logs its lifecycle so we can check that things happen
// the right number of times (i.e. we are using React properly)
export default class LifecycleLogger extends Component {
  constructor() {
    super();
    log('contructor');
  }
  componentWillMount() {
    log('componentWillMount');
  }
  componentDidMount() {
    log('componentDidMount');
  }
  componentWillReceiveProps() {
    log('componentWillReceiveProps');
  }
  componentWillUpdate() {
    log('componentWillUpdate');
  }
  componentDidUpdate() {
    log('componentDidUpdate');
  }
  componentWillUnmount() {
    log('componentWillUnmount');
  }
  componentDidCatch() {
    log('componentDidCatch');
  }
  render() {
    log('render');
    return <div>Lifecycle methods are logged to the console</div>;
  }
}
