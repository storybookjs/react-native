import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import {
  Animated,
  Dimensions,
  Easing,
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  StatusBar,
} from 'react-native';
import style from './style';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';

/**
 * Returns true if the screen is in portrait mode
 */
const isDeviceInPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const openMenuImage = require('./menu_open.png');
const closeMenuImage = require('./menu_close.png');

const DRAWER_WIDTH = 250;

export default class OnDeviceUI extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      menuAnimation: new Animated.Value(0),
      isMenuOpen: false,
      selectedKind: null,
      selectedStory: null,
      isPortrait: isDeviceInPortrait(),
    };
  }

  componentWillMount = () => {
    Dimensions.addEventListener('change', this.handleDeviceRotation);
    this.props.events.on('story', this.handleStoryChange);
  };

  componentDidMount() {
    StatusBar.setHidden(true);
  }

  componentWillUnmount = () => {
    Dimensions.removeEventListener('change', this.handleDeviceRotation);
    this.props.events.removeListener('story', this.handleStoryChange);
  };

  handleDeviceRotation = () => {
    this.setState({
      isPortrait: isDeviceInPortrait(),
    });
  };

  handleStoryChange = (storyFn, selection) => {
    const { kind, story } = selection;
    this.setState({
      selectedKind: kind,
      selectedStory: story,
    });
  };

  handleToggleMenu = () => {
    const isMenuOpen = !this.state.isMenuOpen;

    Animated.timing(this.state.menuAnimation, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 150,
      easing: Easing.linear,
    }).start();

    this.setState({
      isMenuOpen,
    });
  };

  render() {
    const { stories, events, url } = this.props;
    const { isPortrait, menuAnimation, selectedKind, selectedStory } = this.state;

    const iPhoneXStyles = ifIphoneX(
      isPortrait
        ? {
            marginVertical: 30,
          }
        : {
            marginHorizontal: 30,
          },
      {}
    );

    const menuStyles = [
      style.menuContainer,
      {
        transform: [
          {
            translateX: menuAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-DRAWER_WIDTH - 30, 0],
            }),
          },
        ],
      },
      iPhoneXStyles,
    ];

    const headerStyles = [
      style.headerContainer,
      {
        opacity: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      },
    ];

    const previewContainerStyles = [style.previewContainer, iPhoneXStyles];

    const previewWrapperStyles = [style.previewWrapper, iPhoneXStyles];

    /*
      Checks if import is a base64 encoded string uri.
      If using haul as bundler, some projects are set up to include small files as base64 strings.
     */
    let openIcon = openMenuImage;
    if (typeof openIcon === 'string') {
      openIcon = { uri: openMenuImage };
    }
    let closeIcon = closeMenuImage;
    if (typeof closeIcon === 'string') {
      closeIcon = { uri: closeMenuImage };
    }

    return (
      <View style={style.main}>
        <View style={previewContainerStyles}>
          <Animated.View style={headerStyles}>
            <TouchableWithoutFeedback
              onPress={this.handleToggleMenu}
              testID="Storybook.OnDeviceUI.open"
              accessibilityLabel="Storybook.OnDeviceUI.open"
            >
              <View>
                <Image source={openIcon} style={style.icon} />
              </View>
            </TouchableWithoutFeedback>
            <Text style={style.headerText} numberOfLines={1}>
              {selectedKind} {selectedStory}
            </Text>
          </Animated.View>
          <View style={previewWrapperStyles}>
            <View style={style.preview}>
              <StoryView url={url} events={events} />
            </View>
          </View>
        </View>
        <Animated.View style={menuStyles}>
          <TouchableWithoutFeedback
            onPress={this.handleToggleMenu}
            testID="Storybook.OnDeviceUI.close"
            accessibilityLabel="Storybook.OnDeviceUI.close"
          >
            <View style={style.closeButton}>
              <Image source={closeIcon} style={style.icon} />
            </View>
          </TouchableWithoutFeedback>
          <StoryListView
            stories={stories}
            events={events}
            width={DRAWER_WIDTH}
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
  url: PropTypes.string,
};

OnDeviceUI.defaultProps = {
  url: '',
};
