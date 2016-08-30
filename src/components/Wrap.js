import React from 'react';

export default class Wrap extends React.Component {
  constructor(props) {
    super(props);
    this._initialPropsReceived = this.initialPropsReceived.bind(this);
    this._knobChanged = this.knobChanged.bind(this);
    this._resetKnobs = this.resetKnobs.bind(this);
    this._knobsAreReset = false;
    this.gotHello = () => {
      this.props.channel.emit('addon:knobs:helloFromStory');
    };
    this.setPanelFields = () => {
      this.props.channel.emit('addon:knobs:setFields', this.props.store);
    };
  }

  componentDidMount() {
    this.props.channel.on('addon:knobs:initialFields', this._initialPropsReceived);
    this.props.channel.on('addon:knobs:knobChange', this._knobChanged);
    this.props.channel.on('addon:knobs:reset', this._resetKnobs);
    this.props.channel.on('addon:knobs:helloFromPanel', this.gotHello);
    this.props.channel.on('addon:knobs:panelReady', this.setPanelFields);
    this.props.channel.emit('addon:knobs:helloFromStory');
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:initialFields', this._initialPropsReceived);
    this.props.channel.removeListener('addon:knobs:knobChange', this._knobChanged);
    this.props.channel.removeListener('addon:knobs:reset', this._resetKnobs);
    this.props.channel.removeListener('addon:knobs:helloFromPanel', this.gotHello);
    this.props.channel.removeListener('addon:knobs:panelReady', this.setPanelFields);
  }

  initialPropsReceived(initialProps) {
    Object.keys(initialProps).forEach(change => {
      const { name, value } = initialProps[change];
      this.knobChanged({ name, value });
    });
  }

  knobChanged(change) {
    const { name, value } = change;
    const { type } = this.props.store[name];

    let formatedValue = value;
    if (type === 'object') {
      try {
        formatedValue = eval(`(${value})`); // eslint-disable-line no-eval
      } catch (e) {
        return;
      }
    }

    this.props.store[name].value = formatedValue;
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
