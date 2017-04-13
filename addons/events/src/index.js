/* eslint-disable jsx-a11y/anchor-has-content,
  jsx-a11y/anchor-has-content,
  jsx-a11y/aria-props,
  jsx-a11y/aria-proptypes,
  jsx-a11y/aria-proptypes,
  jsx-a11y/aria-unsupported-elements,
  jsx-a11y/aria-unsupported-elements,
  jsx-a11y/href-no-hash,
  jsx-a11y/href-no-hash,
  jsx-a11y/img-has-alt,
  jsx-a11y/img-has-alt,
  jsx-a11y/img-redundant-alt,
  jsx-a11y/img-redundant-alt,
  jsx-a11y/label-has-for,
  jsx-a11y/label-has-for,
  jsx-a11y/aria-role,
  jsx-a11y/aria-role,
  jsx-a11y/role-supports-aria-props,
  jsx-a11y/role-supports-aria-props,
  jsx-a11y/tabindex-no-positive,
  jsx-a11y/tabindex-no-positive,
  jsx-a11y/heading-has-content,
  jsx-a11y/heading-has-content,
  jsx-a11y/html-has-lang,
  jsx-a11y/html-has-lang,
  jsx-a11y/lang,
  jsx-a11y/lang,
  jsx-a11y/role-has-required-aria-props,
  jsx-a11y/scope,
  jsx-a11y/no-static-element-interactions
 */

import { Component, PropTypes } from 'react';
import addons from '@kadira/storybook-addons';

export default class WithEvents extends Component {
  static propTypes = {
    emit: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  };

  componentDidMount() {
    const { emit, children, ...events } = this.props;

    this.channel = addons.getChannel();

    this.channel.on('z4o4z/events/emit', this.onEmit);

    this.channel.emit('z4o4z/events/add', Object.values(events));
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.channel.removeListener('z4o4z/events/emit');
  }

  onEmit = (event) => {
    this.props.emit(event.name, event.payload);
  };

  render() {
    return this.props.children;
  }
}
