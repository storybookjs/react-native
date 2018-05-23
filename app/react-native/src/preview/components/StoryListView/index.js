import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SectionList, View, Text, TouchableOpacity } from 'react-native';
import Events from '@storybook/core-events';
import style from './style';

const SectionHeader = ({ title, selected }) => (
  <View key={title} style={style.header}>
    <Text style={[style.headerText, selected && style.headerTextSelected]}>{title}</Text>
  </View>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

const ListItem = ({ kind, title, selected, onPress }) => (
  <TouchableOpacity
    key={title}
    style={style.item}
    onPress={onPress}
    testID={`Storybook.ListItem.${kind}.${title}`}
    accessibilityLabel={`Storybook.ListItem.${title}`}
  >
    <Text style={[style.itemText, selected && style.itemTextSelected]}>{title}</Text>
  </TouchableOpacity>
);

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default class StoryListView extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      data: [],
    };

    this.storyAddedHandler = this.handleStoryAdded.bind(this);
    this.changeStoryHandler = this.changeStory.bind(this);

    this.props.stories.on(Events.STORY_ADDED, this.storyAddedHandler);
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
    this.props.stories.removeListener(Events.STORY_ADDED, this.storyAddedHandler);
  }

  handleStoryAdded() {
    if (this.props.stories) {
      const data = this.props.stories.dumpStoryBook().map(
        section => ({
          title: section.kind,
          data: section.stories.map(story => ({
            key: story,
            name: story,
            kind: section.kind,
          })),
        }),
        {}
      );
      this.setState({
        data,
      });
    }
  }

  changeStory(kind, story) {
    this.props.events.emit(Events.SET_CURRENT_STORY, { kind, story });
  }

  render() {
    return (
      <SectionList
        testID="Storybook.ListView"
        style={[style.list, { width: this.props.width }]}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            kind={item.kind}
            selected={
              item.kind === this.props.selectedKind && item.name === this.props.selectedStory
            }
            onPress={() => this.changeStory(item.kind, item.name)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionHeader title={title} selected={title === this.props.selectedKind} />
        )}
        keyExtractor={(item, index) => item + index}
        sections={this.state.data}
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
  selectedKind: PropTypes.string,
  selectedStory: PropTypes.string,
  width: PropTypes.number.isRequired,
};

StoryListView.defaultProps = {
  selectedKind: null,
  selectedStory: null,
};
