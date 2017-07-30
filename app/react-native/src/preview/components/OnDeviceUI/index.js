import React, { Component, PropTypes } from 'react';
import { Animated, Easing, View, TouchableOpacity, Text } from 'react-native';
import style from './style';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';

export default class OnDeviceUI extends Component {
  state = {
    menuAnimation: new Animated.Value(0),
    isMenuOpen: false,
  };

  handleToggleMenu = () => {
    const isMenuOpen = !this.state.isMenuOpen;

    Animated.timing(this.state.menuAnimation, {
      toValue: isMenuOpen ? 250 : 0,
      duration: 150,
      easing: Easing.linear,
    }).start();

    this.setState({
      isMenuOpen,
    });
  };

  render() {
    const { stories, events, url } = this.props;
    const { menuAnimation } = this.state;

    const menuStyles = [
      style.menuContainer,
      {
        transform: [{ translateX: menuAnimation }],
      },
    ];

    return (
      <View style={style.main}>
        <View style={style.previewContainer}>
          <View style={style.preview}>
            <StoryView url={url} events={events} />
          </View>
        </View>
        <View style={style.openMenuButton}>
          <TouchableOpacity onPress={this.handleToggleMenu}>
            <View>
              <Text>Open Menu</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Animated.View style={menuStyles}>
          <TouchableOpacity onPress={this.handleToggleMenu}>
            <View>
              <Text>Close Menu</Text>
            </View>
          </TouchableOpacity>
          <StoryListView stories={stories} events={events} />
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
