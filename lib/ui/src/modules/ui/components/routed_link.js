import PropTypes from 'prop-types';
import React from 'react';

const LEFT_BUTTON = 0;

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
function isPlainLeftClick(e) {
  return e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
}

export default class RoutedLink extends React.Component {
  constructor(...args) {
    super(...args);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (this.props.onClick && isPlainLeftClick(e)) {
      e.preventDefault();
      this.props.onClick(e);
    }
  }

  render() {
    const { onClick, href, children, overrideParams, ...restProps } = this.props;
    return (
      <a onClick={this.onClick} href={href} {...restProps}>
        {children}
      </a>
    );
  }
}

RoutedLink.defaultProps = {
  onClick: null,
  href: '#',
  children: null,
  overrideParams: null,
};

RoutedLink.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string,
  children: PropTypes.node,
  overrideParams: PropTypes.shape({}),
};
