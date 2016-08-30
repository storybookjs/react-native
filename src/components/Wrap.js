import React from 'react';

export default class Wrap extends React.Component {
  constructor(props) {
    super(props);
    this._initialPropsReceived = this.initialPropsReceived.bind(this);
    this._knobChanged = this.knobChanged.bind(this);
    this._resetKnobs = this.resetKnobs.bind(this);
    this._knobsAreReset = false;
    this.setPanelFields = () => {
      this.props.channel.emit('addon:knobs:setFields', this.props.store);
    };
  }

  componentDidMount() {
    this.props.channel.on('addon:knobs:knobChange', this._knobChanged);
    this.props.channel.on('addon:knobs:reset', this._resetKnobs);
    this.setPanelFields();
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:knobChange', this._knobChanged);
    this.props.channel.removeListener('addon:knobs:reset', this._resetKnobs);
  }

  initialPropsReceived(initialProps) {
    Object.keys(initialProps).forEach(change => {
      const { name, value } = initialProps[change];
      this.knobChanged({ name, value });
    });
  }

  knobChanged(change) {
    const { name, value } = change;

    this.props.store[name].value = value;
    this.forceUpdate();
  }

  resetKnobs() {
    Object.keys(this.props.store).forEach(field => {
      delete(this.props.store[field]);
    });
    this.forceUpdate();
    this.setPanelFields();
  }

  render() {
    return <div>{this.props.storyFn(this.props.context)}</div>;
  }
}

Wrap.propTypes = {
  context: React.PropTypes.object,
  storyFn: React.PropTypes.func,
  channel: React.PropTypes.object,
  store: React.PropTypes.object,
};
