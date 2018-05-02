/** @jsx m */

// eslint-disable-next-line import/no-extraneous-dependencies
import m from 'mithril';

import addons from '@storybook/addons';

import Events from './events';

export class BackgroundDecorator {
  constructor(vnode) {
    this.props = vnode.attrs;

    const { channel, story } = vnode.attrs;

    // A channel is explicitly passed in for testing
    if (channel) {
      this.channel = channel;
    } else {
      this.channel = addons.getChannel();
    }

    this.story = story();
  }

  oncreate() {
    this.channel.emit(Events.SET, this.props.backgrounds);
  }

  onremove() {
    this.channel.emit(Events.UNSET);
  }

  view() {
    return m(this.story);
  }
}

export default backgrounds => story => ({
  view: () => <BackgroundDecorator story={story} backgrounds={backgrounds} />,
});
