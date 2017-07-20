import React, { PropTypes } from 'react';
import { View } from 'react-native';
import style from './style';
import StoryListView from '../StoryListView';
import StoryView from '../StoryView';

export default function OnDeviceUI(props) {
  const { stories, events, url } = props;

  return (
    <View style={style.main}>
      <View style={style.leftPanel}>
        <StoryListView stories={stories} events={events} />
      </View>
      <View style={style.rightPanel}>
        <View style={style.preview}>
          <StoryView url={url} events={events} />
        </View>
      </View>
    </View>
  );
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
