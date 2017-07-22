import React, { Component, PropTypes } from 'react';
import { SectionList, View, Text, TouchableOpacity } from 'react-native';
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
    this.state = {
      sections: [],
      selectedKind: null,
      selectedStory: null,
    };

    this.storyAddedHandler = this.handleStoryAdded.bind(this);
    this.storyChangedHandler = this.handleStoryChanged.bind(this);
    this.changeStoryHandler = this.changeStory.bind(this);

    this.props.stories.on('storyAdded', this.storyAddedHandler);
    this.props.events.on('story', this.storyChangedHandler);
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
    this.props.stories.removeListener('storyAdded', this.storiesHandler);
    this.props.events.removeListener('story', this.storyChangedHandler);
  }

  handleStoryAdded() {
    if (this.props.stories) {
      const data = this.props.stories.dumpStoryBook();
      this.setState({
        sections: data.map(section => ({
          key: section.kind,
          title: section.kind,
          data: section.stories.map(story => ({
            key: story,
            kind: section.kind,
            name: story,
          })),
        })),
      });
    }
  }

  handleStoryChanged(storyFn, selection) {
    const { kind, story } = selection;
    this.setState({
      selectedKind: kind,
      selectedStory: story,
    });
  }

  changeStory(kind, story) {
    this.props.events.emit('setCurrentStory', { kind, story });
  }

  render() {
    return (
      <SectionList
        style={style.list}
        renderItem={({ item }) =>
          <ListItem
            title={item.name}
            selected={
              item.kind === this.state.selectedKind && item.name === this.state.selectedStory
            }
            onPress={() => this.changeStory(item.kind, item.name)}
          />}
        renderSectionHeader={({ section }) =>
          <SectionHeader
            title={section.title}
            selected={section.title === this.state.selectedKind}
          />}
        sections={this.state.sections}
        stickySectionHeadersEnabled={false}
      />
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
};
