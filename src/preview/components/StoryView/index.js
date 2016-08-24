import React, { Component } from 'react';

export default class StoryView extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {storyFn: () => null};
    this.props.events.on('story', storyFn => this.setState({storyFn}));
  }

  render() {
    return this.state.storyFn();
  }
}
