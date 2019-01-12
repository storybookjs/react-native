import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { navigate, hrefTo } from '../../preview';

// FIXME: copied from Typography.Link. Code is duplicated to
// avoid emotion dependency which breaks React 15.x back-compat

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const LEFT_BUTTON = 0;

const isPlainLeftClick = e =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

const cancelled = (e, cb = () => {}) => {
  if (isPlainLeftClick(e)) {
    e.preventDefault();
    cb(e);
  }
};

export default class LinkTo extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      href: '/',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.updateHref();
  }

  componentDidUpdate(prevProps) {
    const { kind, story } = this.props;

    if (prevProps.kind !== kind || prevProps.story !== story) {
      this.updateHref();
    }
  }

  async updateHref() {
    const { kind, story } = this.props;
    const href = await hrefTo(kind, story);
    this.setState({ href });
  }

  handleClick() {
    navigate(this.props);
  }

  render() {
    const { kind, story, children, ...rest } = this.props;
    const { href } = this.state;

    return (
      <a href={href} onClick={e => cancelled(e, this.handleClick)} {...rest}>
        {children}
      </a>
    );
  }
}

LinkTo.defaultProps = {
  kind: null,
  story: null,
  children: undefined,
};

LinkTo.propTypes = {
  kind: PropTypes.string,
  story: PropTypes.string,
  children: PropTypes.node,
};
