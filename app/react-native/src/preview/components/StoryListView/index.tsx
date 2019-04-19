import React, { Component } from 'react';
import { SectionList, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
import Events from '@storybook/core-events';
import addons from '@storybook/addons';
import style from './style';

interface SectionProps {
  title: string;
  selected: boolean;
}

const SectionHeader: React.FunctionComponent<SectionProps> = ({
  title,
  selected,
}: SectionProps) => (
  <View key={title} style={style.header}>
    <Text style={[style.headerText, selected && style.headerTextSelected]}>{title}</Text>
  </View>
);

interface ListItemProps {
  title: string;
  kind: string;
  selected: boolean;
  onPress: () => void;
}

const ListItem: React.FunctionComponent<ListItemProps> = ({ kind, title, selected, onPress }) => (
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

interface Props {
  stories: any;
  selectedKind?: string;
  selectedStory?: string;
}

interface State {
  data: any[];
  originalData: any[];
}

export default class StoryListView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: [],
      originalData: [],
    };
  }

  componentDidMount() {
    const channel = addons.getChannel();
    channel.on(Events.STORY_ADDED, this.handleStoryAdded);
    this.handleStoryAdded();
  }

  componentWillUnmount() {
    const channel = addons.getChannel();
    channel.removeListener(Events.STORY_ADDED, this.handleStoryAdded);
  }

  handleStoryAdded = () => {
    const { stories } = this.props;

    if (stories) {
      const data = stories.dumpStoryBook().map(
        (section: any) => ({
          title: section.kind,
          data: section.stories.map((story: any) => ({
            key: story,
            name: story,
            kind: section.kind,
          })),
        }),
        {}
      );

      this.setState({ data, originalData: data });
    }
  };

  handleChangeSearchText = (text: string) => {
    const query = text.trim();
    const { originalData: data } = this.state;

    if (!query) {
      this.setState({ data });
      return;
    }

    const checkValue = (value: string) => value.toLowerCase().includes(query.toLowerCase());
    const filteredData = data.reduce((acc, story) => {
      const hasTitle = checkValue(story.title);
      const hasKind = story.data.some((ref: any) => checkValue(ref.name));

      if (hasTitle || hasKind) {
        acc.push({
          ...story,
          // in case the query matches component's title, all of its stories will be shown
          data: !hasTitle ? story.data.filter((ref: any) => checkValue(ref.name)) : story.data,
        });
      }

      return acc;
    }, []);

    this.setState({ data: filteredData });
  };

  changeStory(kind: string, story: string) {
    const channel = addons.getChannel();
    channel.emit(Events.SET_CURRENT_STORY, { kind, story });
  }

  render() {
    const { selectedKind, selectedStory } = this.props;
    const { data } = this.state;

    return (
      <SafeAreaView style={style.flex}>
        <TextInput
          clearButtonMode="while-editing"
          disableFullscreenUI
          onChangeText={this.handleChangeSearchText}
          placeholder="Filter"
          returnKeyType="search"
          style={style.searchBar}
        />
        <SectionList
          testID="Storybook.ListView"
          style={style.sectionList}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              kind={item.kind}
              selected={item.kind === selectedKind && item.name === selectedStory}
              onPress={() => this.changeStory(item.kind, item.name)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={'title'} selected={title === selectedKind} />
          )}
          keyExtractor={(item, index) => item + index}
          sections={data}
          stickySectionHeadersEnabled={false}
        />
      </SafeAreaView>
    );
  }
}
