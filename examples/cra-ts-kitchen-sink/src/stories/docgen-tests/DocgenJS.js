/* eslint-disable react/button-has-type */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Button functional component
 */
export const ButtonFn = ({ onClick, children }) => <button onClick={onClick}>{children}</button>;
ButtonFn.propTypes = {
  /**
   * onClick description
   */
  onClick: PropTypes.func,
};
ButtonFn.defaultProps = {
  onClick: null,
};

/**
 * Button class React.Component
 */
export class ButtonReactComponent extends React.Component {
  render() {
    const { onClick, children } = this.props;
    return <button onClick={onClick}>{children}</button>;
  }
}
ButtonReactComponent.propTypes = {
  /**
   * onClick description
   */
  onClick: PropTypes.func,
};
ButtonReactComponent.defaultProps = {
  onClick: null,
};

/**
 * Button class Component
 */
export class ButtonComponent extends Component {
  render() {
    const { onClick, children } = this.props;
    return <button onClick={onClick}>{children}</button>;
  }
}
ButtonComponent.propTypes = {
  /**
   * onClick description
   */
  onClick: PropTypes.func,
};
ButtonComponent.defaultProps = {
  onClick: null,
};

/**
 * Button class static props
 */
export class ButtonStaticProps extends Component {
  static propTypes = {
    /**
     * onClick description
     */
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  render() {
    const { onClick, children } = this.props;
    return <button onClick={onClick}>{children}</button>;
  }
}
