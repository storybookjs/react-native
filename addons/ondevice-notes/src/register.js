import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-simple-markdown';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';

export const PARAM_KEY = `notes`;

class Notes extends React.Component {
  setBackgroundFromSwatch = background => {
    this.props.channel.emit(Constants.UPDATE_BACKGROUND, background);
  };

  componentDidMount() {
    this.props.channel.on(Events.SELECT_STORY, this.onStorySelected);
  }

  componentWillUnmount() {
    this.props.channel.removeListener(Events.SELECT_STORY, this.onStorySelected);
  }

  onStorySelected = selection => {
    this.setState({ selection });
  };

  render() {
    const { active, api } = this.props;

    if (!active) {
      return null;
    }

    const story = api
      .store()
      .getStoryAndParameters(this.state.selection.kind, this.state.selection.story);
    const text = story.parameters[PARAM_KEY];

    const textAfterFormatted = text ? text.trim() : '';

    return (
      <View style={{ padding: 10, flex: 1 }}>
        <Markdown>{textAfterFormatted}</Markdown>
      </View>
    );
  }
}

addons.register('storybook/notes', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/notes/panel', {
    title: 'Notes',
    render: ({ active, key }) => <Notes key={key} channel={channel} api={api} active={active} />,
  });
});
