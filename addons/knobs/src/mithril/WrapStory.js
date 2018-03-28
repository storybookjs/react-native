// eslint-disable-next-line import/no-extraneous-dependencies
import m from 'mithril';

export default class WrapStory {
  constructor(vnode) {
    this.knobChanged = this.knobChanged.bind(this);
    this.knobClicked = this.knobClicked.bind(this);
    this.resetKnobs = this.resetKnobs.bind(this);
    this.setPaneKnobs = this.setPaneKnobs.bind(this);
    this.props = vnode.attrs;
    this.storyContent = vnode.attrs.initialContent;
  }

  oncreate() {
    // Watch for changes in knob editor.
    this.props.channel.on('addon:knobs:knobChange', this.knobChanged);
    // Watch for clicks in knob editor.
    this.props.channel.on('addon:knobs:knobClick', this.knobClicked);
    // Watch for the reset event and reset knobs.
    this.props.channel.on('addon:knobs:reset', this.resetKnobs);
    // Watch for any change in the knobStore and set the panel again for those
    // changes.
    this.props.knobStore.subscribe(this.setPaneKnobs);
    // Set knobs in the panel for the first time.
    this.setPaneKnobs();
  }

  onremove() {
    this.props.channel.removeListener('addon:knobs:knobChange', this.knobChanged);
    this.props.channel.removeListener('addon:knobs:knobClick', this.knobClicked);
    this.props.channel.removeListener('addon:knobs:reset', this.resetKnobs);
    this.props.knobStore.unsubscribe(this.setPaneKnobs);
  }

  setPaneKnobs(timestamp = +new Date()) {
    const { channel, knobStore } = this.props;
    channel.emit('addon:knobs:setKnobs', { knobs: knobStore.getAll(), timestamp });
  }

  knobChanged(change) {
    const { name, value } = change;
    const { knobStore, storyFn, context } = this.props;
    // Update the related knob and it's value.
    const knobOptions = knobStore.get(name);

    knobOptions.value = value;
    knobStore.markAllUnused();
    this.storyContent = storyFn(context);
    m.redraw();
  }

  knobClicked(clicked) {
    const knobOptions = this.props.knobStore.get(clicked.name);
    knobOptions.callback();
  }

  resetKnobs() {
    const { knobStore, storyFn, context } = this.props;
    knobStore.reset();
    this.storyContent = storyFn(context);
    m.redraw();
    this.setPaneKnobs(false);
  }

  view() {
    return m(this.storyContent);
  }
}
