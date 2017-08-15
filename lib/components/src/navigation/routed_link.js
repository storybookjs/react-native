import PropTypes from 'prop-types';
import React from 'react';

const LEFT_BUTTON = 0;

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const isPlainLeftClick = e =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

export default class RoutedLink extends React.Component {
  constructor(...args) {
    super(...args);

    const { onClick } = args[0];
    if (onClick) {
      this.onClick = e => (isPlainLeftClick(e) ? e.preventDefault() || onClick(e) : false);
    }
  }

  render() {
    const { onClick } = this;
    const { href, children, ...rest } = this.props;
    return (
      <a {...{ href, ...rest, onClick }}>
        {children}
      </a>
    );
  }
}

RoutedLink.defaultProps = {
  onClick: null,
  href: '#',
  children: null,
};

RoutedLink.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string,
  children: PropTypes.node,
};
