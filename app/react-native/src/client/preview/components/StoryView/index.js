import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Events from '@storybook/core-events';
import style from './style';

export default class StoryView extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = { storyFn: null, selection: {} };

    if (props.listenToEvents) {
      this.storyHandler = this.selectStory.bind(this);
      this.forceRender = this.forceUpdate.bind(this);
      props.events.on(Events.SELECT_STORY, this.storyHandler);
      props.events.on(Events.FORCE_RE_RENDER, this.forceRender);
    }
  }

  componentWillUnmount() {
    const { listenToEvents, events } = this.props;

    if (listenToEvents) {
      events.removeListener(Events.SELECT_STORY, this.storyHandler);
      events.removeListener(Events.FORCE_RE_RENDER, this.forceRender);
    }
  }

  selectStory = selection => {
    this.setState({ storyFn: selection.storyFn, selection });
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

  renderOnDeviceUIHelp = () => (
    <View style={style.help}>
      <Text>Please open navigator and select a story to preview.</Text>
    </View>
  );

  render() {
    const { listenToEvents } = this.props;

    if (listenToEvents) {
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

    const { storyFn, selection } = this.props;
    const { kind, story } = selection;

    return storyFn ? (
      <View key={`${kind}:::${story}`} style={style.main}>
        {storyFn()}
      </View>
    ) : (
      this.renderOnDeviceUIHelp()
    );
  }
}

StoryView.propTypes = {
  listenToEvents: PropTypes.bool,
  storyFn: PropTypes.func,
  selection: PropTypes.shape({
    kind: PropTypes.string,
    story: PropTypes.string,
  }),
  events: PropTypes.shape({
    on: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  url: PropTypes.string,
};

StoryView.defaultProps = {
  url: '',
  listenToEvents: false,
  selection: {},
  storyFn: null,
};
