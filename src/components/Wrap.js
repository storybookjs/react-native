import React from 'react';

export default class Wrap extends React.Component {
  constructor(props) {
    super(props);
    this._knobChanged = this.knobChanged.bind(this);
    this._resetKnobs = this.resetKnobs.bind(this);
    this._knobsAreReset = false;
  }

  componentDidMount() {
    this.props.knobsReset();
    this.props.channel.on('addon:knobs:propChange', this._knobChanged);
    this.props.channel.on('addon:knobs:reset', this._resetKnobs);
  }

  componentDidUpdate() {
    if(this._knobsAreReset) {
      this.props.knobsReset();
      this._knobsAreReset = false;
    }
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:propChange', this._knobChanged);
    this.props.channel.removeListener('addon:knobs:reset', this._resetKnobs);
  }

  knobChanged(change) {
    const success = this.props.knobChanged(change);
    if(success) {
      // Only update if the knob change is valid
      this.forceUpdate();
    }
  }

  resetKnobs(change) {
    this._knobsAreReset = true;
    this.props.resetKnobs();
    this.forceUpdate();
  }

  render() {
    return <div>{this.props.storyFn(this.props.context)}</div>;
  }
}

Wrap.propTypes = {
  context: React.PropTypes.object,
  storyFn: React.PropTypes.func,
  knobChanged: React.PropTypes.func,
  knobsReset: React.PropTypes.func,
  resetKnobs: React.PropTypes.func,
  channel: React.PropTypes.object,
};
