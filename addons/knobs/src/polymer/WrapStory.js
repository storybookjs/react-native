import { window, document, HTMLElement } from 'global';

class WrapStory extends HTMLElement {
  static get is() {
    return 'wrap-story';
  }

  get template() {
    return '<div id="wrapper"></div>';
  }

  constructor(component, channel, context, storyFn, knobStore) {
    super();

    this.createShadowRoot();
    this.shadowRoot.innerHTML = this.template;

    this.component = component;
    this.channel = channel;
    this.context = context;
    this.storyFn = storyFn;
    this.knobStore = knobStore;

    this.connectChannel(this.channel);
    this.render(this.component);
  }

  connectChannel(channel) {
    channel.on('addon:knobs:knobChange', change => {
      const { name, value } = change;
      const { knobStore, storyFn, context } = this;
      // Update the related knob and it's value.
      const knobOptions = knobStore.get(name);

      knobOptions.value = value;
      knobStore.markAllUnused();
      this.render(storyFn(context));
    });
  }

  render(component) {
    let tag = component;
    if (typeof component === 'string') {
      const tagName = /^<([A-Za-z0-9-]+)/.exec(component)[1];
      tag = document.createElement(tagName);
    }

    const wrapper = this.shadowRoot.querySelector('div#wrapper');

    wrapper.innerHTML = '';
    wrapper.appendChild(tag);
  }
}

window.customElements.define(WrapStory.is, WrapStory);

export default WrapStory;
