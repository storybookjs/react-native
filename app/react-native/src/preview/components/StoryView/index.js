import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Events from '@storybook/core-events';
import style from './style';

export default class StoryView extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = { storyFn: null, selection: {} };

    this.storyHandler = this.selectStory.bind(this);
    this.forceRender = this.forceUpdate.bind(this);

    props.events.on(Events.SELECT_STORY, this.storyHandler);
    props.events.on(Events.FORCE_RE_RENDER, this.forceRender);
  }

  componentWillUnmount() {
    const { events } = this.props;

    events.removeListener(Events.SELECT_STORY, this.storyHandler);
    events.removeListener(Events.FORCE_RE_RENDER, this.forceRender);
  }

  selectStory = (selection, storyFn) => {
    this.setState({ storyFn, selection });
  };

  renderHelp = () => {
    const { url } = this.props;
    return (
      <View style={style.help}>
        {url && url.length ? (
          <Text>
            Please open the Storybook UI ({url}) with a web browser and select a story for preview.
          </Text>
        ) : (
          <Text>
            Please open the Storybook UI with a web browser and select a story for preview.
          </Text>
        )}
      </View>
    );
  };

  render() {
    const { storyFn, selection } = this.state;
    const { kind, story } = selection;

    return storyFn ? (
      <View key={`${kind}:::${story}`} style={style.main}>
        {storyFn()}
      </View>
    ) : (
      this.renderHelp()
    );
  }
}

StoryView.propTypes = {
  events: PropTypes.shape({
    on: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  url: PropTypes.string,
};

StoryView.defaultProps = {
  url: '',
};
