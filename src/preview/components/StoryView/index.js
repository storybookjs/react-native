import React, { Component } from 'react';
import { View } from 'react-native';
import style from './style';

export default class StoryView extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {storyFn: null, selection: {}};
    this.props.events.on('story', this.selectStory.bind(this));
  }

  selectStory(storyFn, selection) {
    this.setState({storyFn, selection});
  }

  render() {
    if (!this.state.storyFn) {
      return null;
    }
    const { kind, story } = this.state.selection;
    const context = { kind, story };
    return (
      <View key={`${kind}:::${story}`} style={style.main}>
        {this.state.storyFn(context)}
      </View>
    );
  }
}
