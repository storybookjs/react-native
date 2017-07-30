import React, { Component, PropTypes } from 'react';
import { Animated, Easing, View, TouchableWithoutFeedback, Image, Text } from 'react-native';
import style from './style';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';

export default class OnDeviceUI extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      menuAnimation: new Animated.Value(0),
      isMenuOpen: false,
      selectedKind: null,
      selectedStory: null,
    };

    this.storyChangedHandler = this.handleStoryChanged.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);

    this.props.events.on('story', this.storyChangedHandler);
  }

  componentWillUnmount() {
    this.props.events.removeListener('story', this.storyChangedHandler);
  }

  handleStoryChanged(storyFn, selection) {
    const { kind, story } = selection;
    this.setState({
      selectedKind: kind,
      selectedStory: story,
    });
  }

  handleToggleMenu() {
    const isMenuOpen = !this.state.isMenuOpen;

    Animated.timing(this.state.menuAnimation, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 150,
      easing: Easing.linear,
    }).start();

    this.setState({
      isMenuOpen,
    });
  }

  render() {
    const { stories, events, url } = this.props;
    const { isMenuOpen, menuAnimation, selectedKind, selectedStory } = this.state;

    const overlayStyles = [style.overlayContainer, { opacity: menuAnimation }];

    const menuStyles = [
      style.menuContainer,
      {
        transform: [
          {
            translateX: menuAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 250],
            }),
          },
        ],
      },
    ];

    /* eslint-disable global-require */
    const openMenuImage = require('./menu_open.png');
    const closeMenuImage = require('./menu_close.png');
    /* eslint-enable global-require */

    return (
      <View style={style.main}>
        <View style={style.previewContainer}>
          <View style={style.headerContainer}>
            <TouchableWithoutFeedback onPress={this.handleToggleMenu}>
              <View>
                <Image source={openMenuImage} style={style.icon} />
              </View>
            </TouchableWithoutFeedback>
            <Text style={style.headerText} numberOfLines={1}>
              {selectedKind} / {selectedStory}
            </Text>
          </View>
          <View style={style.previewWrapper}>
            <View style={style.preview}>
              <StoryView url={url} events={events} />
            </View>
          </View>
        </View>
        {isMenuOpen &&
          <TouchableWithoutFeedback onPress={this.handleToggleMenu}>
            <Animated.View style={overlayStyles} />
          </TouchableWithoutFeedback>}
        <Animated.View style={menuStyles}>
          <TouchableWithoutFeedback onPress={this.handleToggleMenu}>
            <View style={style.closeButton}>
              <Image source={closeMenuImage} style={style.icon} />
            </View>
          </TouchableWithoutFeedback>
          <StoryListView
            stories={stories}
            events={events}
            selectedKind={selectedKind}
            selectedStory={selectedStory}
          />
        </Animated.View>
      </View>
    );
  }
}

OnDeviceUI.propTypes = {
  stories: PropTypes.shape({
    dumpStoryBook: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  events: PropTypes.shape({
    on: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
    removeListener: PropTypes.func.isRequired,
  }).isRequired,
  url: PropTypes.string.isRequired,
};
