import PropTypes from 'prop-types';
import React from 'react';

const LEFT_BUTTON = 0;
// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const isPlainLeftClick = e =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

export default class RoutedLink extends React.Component {
  constructor(...attrs) {
    super(...attrs);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (isPlainLeftClick(e)) {
      e.preventDefault();
      this.props.onClick(e);
    }
  }

  render() {
    const { href, children, onClick } = this.props;
    const props = onClick ? { href, onClick: this.onClick } : { href };
    return <a {...props}>{children}</a>;
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
