import React, { Component } from 'react';
import PropTypes from 'prop-types';

const keyCodeEnter = 13;

export default class MenuItem extends Component {
  onMouseDown = event => {
    // Prevent focusing on mousedown
    event.preventDefault();
  };

  onKeyDown = e => {
    const { onClick } = this.props;
    if (e.keyCode === keyCodeEnter) {
      onClick(e);
    }
  };

  render() {
    const { children, ...restProps } = this.props;

    return (
      <div
        role="menuitem"
        tabIndex="0"
        onKeyDown={this.onKeyDown}
        onMouseDown={this.onMouseDown}
        {...restProps}
      >
        {children}
      </div>
    );
  }
}

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
