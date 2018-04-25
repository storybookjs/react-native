import { document, Node } from 'global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { subscriptionsStore } from '@storybook/core/client';

const WRAPPER_ID = 'sb-knobs-addon-wrapper';

export default class WrapStory {
  constructor(component, channel, context, storyFn, knobStore) {
    this.knobsWrapper = WrapStory.getWrapper();
    this.channel = channel;
    this.context = context;
    this.storyFn = storyFn;
    this.knobStore = knobStore;

    this.knobChanged = this.knobChanged.bind(this);
    this.knobClicked = this.knobClicked.bind(this);
    this.resetKnobs = this.resetKnobs.bind(this);
    this.setPaneKnobs = this.setPaneKnobs.bind(this);
    this.connectCallbacks = this.connectCallbacks.bind(this);
    this.disconnectCallbacks = this.disconnectCallbacks.bind(this);

    subscriptionsStore.register(this.connectCallbacks);

    this.render(component);
  }

  static getWrapper() {
    const knobsWrapperOnDom = document.getElementById(WRAPPER_ID);

    if (knobsWrapperOnDom) {
      return knobsWrapperOnDom;
    }

    const knobsWrapper = document.createElement('div');
    knobsWrapper.setAttribute('id', WRAPPER_ID);

    return knobsWrapper;
  }

  connectCallbacks() {
    this.connectChannel(this.channel);
    this.knobStore.subscribe(this.setPaneKnobs);

    return this.disconnectCallbacks;
  }

  disconnectCallbacks() {
    this.disconnectChannel(this.channel);
    this.knobStore.unsubscribe(this.setPaneKnobs);
  }

  connectChannel(channel) {
    channel.on('addon:knobs:knobChange', this.knobChanged);
    channel.on('addon:knobs:knobClick', this.knobClicked);
    channel.on('addon:knobs:reset', this.resetKnobs);
  }

  disconnectChannel(channel) {
    channel.removeListener('addon:knobs:knobChange', this.knobChanged);
    channel.removeListener('addon:knobs:knobClick', this.knobClicked);
    channel.removeListener('addon:knobs:reset', this.resetKnobs);
  }

  knobChanged(change) {
    const { name, value } = change;
    const { knobStore, storyFn, context } = this;
    // Update the related knob and it's value.
    const knobOptions = knobStore.get(name);

    knobOptions.value = value;
    knobStore.markAllUnused();
    this.render(storyFn(context));
  }

  knobClicked(clicked) {
    const knobOptions = this.knobStore.get(clicked.name);
    knobOptions.callback();
  }

  resetKnobs() {
    const { knobStore, storyFn, context } = this;
    knobStore.reset();
    this.render(storyFn(context));
    this.setPaneKnobs(this.channel, this.knobStore, false);
  }

  setPaneKnobs(timestamp = +new Date()) {
    const { channel, knobStore } = this;
    channel.emit('addon:knobs:setKnobs', { knobs: knobStore.getAll(), timestamp });
  }

  render(component) {
    const wrapper = this.knobsWrapper;

    if (typeof component === 'string') {
      wrapper.innerHTML = component;
    } else if (component instanceof Node) {
      wrapper.innerHTML = '';
      wrapper.appendChild(component);
    }
  }

  getElement() {
    return this.knobsWrapper;
  }
}
