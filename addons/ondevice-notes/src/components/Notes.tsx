/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-simple-markdown';
import { AddonStore } from '@storybook/addons';
import Events from '@storybook/core-events';
import { API } from '@storybook/api';
import { StoryStore } from '@storybook/client-api';

export const PARAM_KEY = `notes`;

type Selection = ReturnType<StoryStore['fromId']>;
interface NotesProps {
  channel: ReturnType<AddonStore['getChannel']>;
  api: API;
  active: boolean;
}
interface NotesState {
  selection: Selection;
}

export class Notes extends Component<NotesProps, NotesState> {
  componentDidMount() {
    this.props.channel.on(Events.SELECT_STORY, this.onStorySelected);
  }

  componentWillUnmount() {
    this.props.channel.removeListener(Events.SELECT_STORY, this.onStorySelected);
  }

  onStorySelected = (selection: Selection) => {
    this.setState({ selection });
  };

  render() {
    const { active, api } = this.props;

    if (!active) {
      return null;
    }

    if (!this.state) {
      return null;
    }

    const story = api
      .store()
      .getStoryAndParameters(this.state.selection.kind, this.state.selection.story);
    const text = story.parameters[PARAM_KEY];

    const textAfterFormatted: string = text ? text.trim() : '';

    return (
      <View style={{ padding: 10, flex: 1 }}>
        <Markdown>{textAfterFormatted}</Markdown>
      </View>
    );
  }
}
