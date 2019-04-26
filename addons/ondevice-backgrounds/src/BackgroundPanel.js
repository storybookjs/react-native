import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Events from '@storybook/core-events';
import Swatch from './Swatch';
import Constants from './constants';

const codeSample = `
import { storiesOf } from '@storybook/react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

addDecorator(withBackgrounds);

storiesOf('First Component', module)
  .addParameters({
    backgrounds: [
      { name: 'warm', value: 'hotpink', default: true },
      { name: 'cool', value: 'deepskyblue' },
    ],
  })
  .add("First Button", () => <Button>Click me</Button>);
`.trim();

const Instructions = () => (
  <View>
    <Text style={{ fontSize: 16 }}>Setup Instructions</Text>
    <Text>
      Please add the background decorator definition to your story. The background decorate accepts
      an array of items, which should include a name for your color (preferably the css class name)
      and the corresponding color / image value.
    </Text>
    <Text>
      Below is an example of how to add the background decorator to your story definition.
    </Text>
    <Text>{codeSample}</Text>
  </View>
);

export default class BackgroundPanel extends Component {
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
    const backgrounds = story.parameters[Constants.PARAM_KEY];

    return (
      <View>
        {backgrounds ? (
          backgrounds.map(({ value, name }) => (
            <View key={`${name} ${value}`}>
              <Swatch value={value} name={name} setBackground={this.setBackgroundFromSwatch} />
            </View>
          ))
        ) : (
          <Instructions />
        )}
      </View>
    );
  }
}
