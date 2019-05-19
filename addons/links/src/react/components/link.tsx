import React, { PureComponent } from 'react';

import { navigate, hrefTo } from '../../preview';

// FIXME: copied from Typography.Link. Code is duplicated to
// avoid emotion dependency which breaks React 15.x back-compat

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const LEFT_BUTTON = 0;

const isPlainLeftClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

const cancelled = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, cb = (_e: any) => {}) => {
  if (isPlainLeftClick(e)) {
    e.preventDefault();
    cb(e);
  }
};

interface Props {
  kind: string;
  story: string;
  children: React.ReactNode;
}

interface State {
  href: string;
}

export default class LinkTo extends PureComponent<Props, State> {
  static defaultProps: Props = {
    kind: null,
    story: null,
    children: undefined,
  };

  state: State = {
    href: '/',
  };

  componentDidMount() {
    this.updateHref();
  }

  componentDidUpdate(prevProps: Props) {
    const { kind, story } = this.props;

    if (prevProps.kind !== kind || prevProps.story !== story) {
      this.updateHref();
    }
  }

  updateHref = async () => {
    const { kind, story } = this.props;
    const href = await hrefTo(kind, story);
    this.setState({ href });
  };

  handleClick = () => {
    navigate(this.props);
  };

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
