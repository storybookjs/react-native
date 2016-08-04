import React from 'react';

export default class Wrap extends React.Component {
  constructor(props) {
    super(props);
    this.channel = this.props.channel;
  }

  componentDidMount() {
    this.channel.on('addon:knobs:propChange', this.forceUpdate.bind(this));
  }

  render() {
    return <div>{this.props.storyFn(this.props.context)}</div>;
  }
}

Wrap.propTypes = {
  context: React.PropTypes.object,
  storyFn: React.PropTypes.func,
  channel: React.PropTypes.object,
};
