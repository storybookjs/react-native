import React from 'react';

export default class Wrap extends React.Component {
  constructor(props) {
    super(props);
    this._knobChanged = this.knobChanged.bind(this);
  }

  componentDidMount() {
    this.props.storyRendered();
    this.props.channel.on('addon:knobs:propChange', this._knobChanged);
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:propChange', this._knobChanged);
  }

  knobChanged(change) {
    this.props.knobChanged(change);
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
  storyRendered: React.PropTypes.func,
  channel: React.PropTypes.object,
};
