import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { RoutedLink } from '@storybook/components';
import { openLink, hrefTo } from '../../preview';

export default class LinkTo extends PureComponent {
  state = {
    href: '/',
  };

  componentDidMount() {
    this.updateHref();
  }

  componentDidUpdate(prevProps) {
    const { kind, story } = this.props;

    if (prevProps.kind !== kind || prevProps.story !== story) {
      this.updateHref();
    }
  }

  handleClick = e => {
    e.preventDefault();
    openLink(this.props);
  };

  async updateHref() {
    const { kind, story } = this.props;
    const href = await hrefTo(kind, story);
    this.setState({ href });
  }

  render() {
    const { kind, story, ...rest } = this.props;
    const { href } = this.state;

    return <RoutedLink href={href} onClick={this.handleClick} {...rest} />;
  }
}

LinkTo.defaultProps = {
  kind: null,
  story: null,
};

LinkTo.propTypes = {
  kind: PropTypes.string,
  story: PropTypes.string,
};
