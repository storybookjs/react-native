import React from 'react';
import PropTypes from 'prop-types';

const keyCodeEnter = 13;

export default class MenuItem extends React.Component {
  constructor(...args) {
    super(...args);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  // Prevent focusing on mousedown
  onMouseDown(event) {
    event.preventDefault();
  }

  onKeyDown(e) {
    if (e.keyCode === keyCodeEnter) {
      this.props.onClick(e);
    }
  }

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
