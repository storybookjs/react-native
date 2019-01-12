import PropTypes from 'prop-types';
import React from 'react';

// NOTE: this is a copy of `lib/components/src/navigation/RoutedLink.js`.
// It's duplicated here because that copy has an explicit dependency on
// React 16.3+, which breaks older versions of React running in the preview.
// The proper DRY solution is to create a new package that doesn't depend
// on a specific react version. However, that's a heavy-handed solution for
// one trivial file.

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
