import React from 'react';

export default class Story extends React.Component {

  shouldComponentUpdate() {
    return this.props.shouldUpdate();
  }

  render() {
    return this.props.storyFn(this.props.context, this.props.createKnob);
  }
}

Story.propTypes = {
  storyFn: React.PropTypes.func.isRequired,
  context: React.PropTypes.object.isRequired,
  createKnob: React.PropTypes.func.isRequired,
  shouldUpdate: React.PropTypes.func.isRequired,
};
