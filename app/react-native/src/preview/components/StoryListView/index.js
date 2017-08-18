import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListView, View, Text, TouchableOpacity } from 'react-native';
import { MinMaxView } from 'react-native-compat';
import style from './style';

const SectionHeader = ({ title, selected }) =>
  <View key={title} style={style.header}>
    <Text style={[style.headerText, selected && style.headerTextSelected]}>
      {title}
    </Text>
  </View>;

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

const ListItem = ({ title, selected, onPress }) =>
  <TouchableOpacity key={title} style={style.item} onPress={onPress}>
    <Text style={[style.itemText, selected && style.itemTextSelected]}>
      {title}
    </Text>
  </TouchableOpacity>;

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default class StoryListView extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource: ds.cloneWithRowsAndSections({}),
    };

    this.storyAddedHandler = this.handleStoryAdded.bind(this);
    this.changeStoryHandler = this.changeStory.bind(this);

    this.props.stories.on('storyAdded', this.storyAddedHandler);
  }

  componentDidMount() {
    this.handleStoryAdded();
    const dump = this.props.stories.dumpStoryBook();
    const nonEmptyKind = dump.find(kind => kind.stories.length > 0);
    if (nonEmptyKind) {
      this.changeStory(nonEmptyKind.kind, nonEmptyKind.stories[0]);
    }
  }

  componentWillUnmount() {
    this.props.stories.removeListener('storyAdded', this.storyAddedHandler);
  }

  handleStoryAdded() {
    if (this.props.stories) {
      const data = this.props.stories.dumpStoryBook();

      const sections = data.reduce(
        (map, section) => ({
          ...map,
          [section.kind]: section.stories.map(story => ({
            key: story,
            name: story,
            kind: section.kind,
          })),
        }),
        {}
      );
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(sections),
      });
    }
  }

  changeStory(kind, story) {
    this.props.events.emit('setCurrentStory', { kind, story });
  }

  render() {
    return (
      <MinMaxView maxWidth={250}>
        <ListView
          style={style.list}
          renderRow={item =>
            <ListItem
              title={item.name}
              selected={
                item.kind === this.props.selectedKind && item.name === this.props.selectedStory
              }
              onPress={() => this.changeStory(item.kind, item.name)}
            />}
          renderSectionHeader={(sectionData, sectionName) =>
            <SectionHeader
              title={sectionName}
              selected={sectionName === this.props.selectedKind}
            />}
          dataSource={this.state.dataSource}
          stickySectionHeadersEnabled={false}
        />
      </MinMaxView>
    );
  }
}

StoryListView.propTypes = {
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
  selectedKind: PropTypes.string,
  selectedStory: PropTypes.string,
};

StoryListView.defaultProps = {
  selectedKind: null,
  selectedStory: null,
};
