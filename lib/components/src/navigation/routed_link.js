import PropTypes from 'prop-types';
import React from 'react';

const LEFT_BUTTON = 0;
// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const isPlainLeftClick = e =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

const wrapOnClick = fn => e => (isPlainLeftClick(e) ? e.preventDefault() || fn(e) : false);

export default class RoutedLink extends React.Component {
  constructor(props, ...rest) {
    super(...[props, ...rest]);

    const { onClick } = props;
    this.onClick = onClick ? wrapOnClick(onClick) : undefined;
  }

  componentWillUpdate({ onClick }) {
    this.onClick = wrapOnClick(onClick);
  }

  render() {
    const { onClick } = this;
    const { href, children, ...rest } = this.props;
    const props = { href, ...rest, onClick };
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
