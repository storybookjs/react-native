import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { RoutedLink } from '@storybook/components';
import { openLink, hrefTo } from '../../preview';

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
    if (prevProps.kind !== this.props.kind || prevProps.story !== this.props.story) {
      this.updateHref();
    }
  }

  async updateHref() {
    const { kind, story } = this.props;
    const href = await hrefTo(kind, story);
    this.setState({ href });
  }

  handleClick() {
    openLink(this.props);
  }

  render() {
    const { kind, story, ...rest } = this.props;

    return <RoutedLink href={this.state.href} onClick={this.handleClick} {...rest} />;
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
