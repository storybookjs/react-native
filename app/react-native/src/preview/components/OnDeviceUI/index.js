import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import style from './style';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';

export default class OnDeviceUI extends Component {
  state = {
    isMenuOpen: false,
  };

  handleOpenMenu = () => {
    this.setState({
      isMenuOpen: true,
    });
  };

  handleCloseMenu = () => {
    this.setState({
      isMenuOpen: false,
    });
  };

  render() {
    const { stories, events, url } = this.props;
    const { isMenuOpen } = this.state;

    return (
      <View style={style.main}>
        <View style={style.previewContainer}>
          <View style={style.preview}>
            <StoryView url={url} events={events} />
          </View>
        </View>
        <View style={style.openMenuButton}>
          <TouchableOpacity onPress={this.handleOpenMenu}>
            <View>
              <Text>Open Menu</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[style.menuContainer, isMenuOpen && style.menuContainerOpen]}>
          <TouchableOpacity onPress={this.handleCloseMenu}>
            <View>
              <Text>Close Menu</Text>
            </View>
          </TouchableOpacity>
          <StoryListView stories={stories} events={events} />
        </View>
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
