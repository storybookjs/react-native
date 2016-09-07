import React from 'react';

export default class WrapStory extends React.Component {
  constructor(props) {
    super(props);
    this.knobChanged = this.knobChanged.bind(this);
    this.resetKnobs = this.resetKnobs.bind(this);
    this._knobsAreReset = false;
  }

  setPanelFields() {
    const { channel, knobStore } = this.props;
    channel.emit('addon:knobs:setKnobs', knobStore.getAll());
  }

  componentDidMount() {
    this.props.channel.on('addon:knobs:knobChange', this.knobChanged);
    this.props.channel.on('addon:knobs:reset', this.resetKnobs);
    this.setPanelFields();
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:knobChange', this.knobChanged);
    this.props.channel.removeListener('addon:knobs:reset', this.resetKnobs);
  }

  knobChanged(change) {
    const { name, value } = change;
    const { knobStore } = this.props;
    // Update the related knob and it's value.
    const knobOptions = knobStore.get(name);
    knobOptions.value = value;
    this.forceUpdate();
  }

  resetKnobs() {
    const { knobStore } = this.props;
    knobStore.reset();
    this.forceUpdate();
    this.setPanelFields();
  }

  render() {
    const { storyFn, context } = this.props;
    return <div>{storyFn(context)}</div>;
  }
}

WrapStory.propTypes = {
  context: React.PropTypes.object,
  storyFn: React.PropTypes.func,
  channel: React.PropTypes.object,
  knobStore: React.PropTypes.object,
};
