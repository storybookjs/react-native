import PropTypes from 'prop-types';
import React from 'react';

const LEFT_BUTTON = 0;
// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const isPlainLeftClick = e =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

export default class RoutedLink extends React.Component {
  onClick = e => {
    const { onClick } = this.props;

    if (isPlainLeftClick(e)) {
      e.preventDefault();
      onClick(e);
    }
  };

  render() {
    const { href, children, onClick, className, style } = this.props;
    const props = onClick
      ? { href, className, style, onClick: this.onClick }
      : { href, className, style };
    return <a {...props}>{children}</a>;
  }
}

RoutedLink.defaultProps = {
  onClick: null,
  href: '#',
  children: null,
  className: undefined,
  style: undefined,
};

RoutedLink.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};
