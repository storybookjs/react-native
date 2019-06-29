/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { SectionList, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
import styled from '@emotion/native';
import Events from '@storybook/core-events';
import addons from '@storybook/addons';
import { EmotionProps } from '../Shared/theme';
import { Header, Name } from '../Shared/text';

const SearchBar: typeof TextInput = styled.TextInput`
  background: ${(props: EmotionProps) => props.theme.borderColor};
  color: ${(props: EmotionProps) => props.theme.buttonActiveTextColor};
  border-top-left-radius: 5;
  border-top-right-radius: 5;
  border-bottom-left-radius: 5;
  border-bottom-right-radius: 5;
  font-size: 16;
  margin-horizontal: 5;
  margin-vertical: 5;
  padding-horizontal: 5;
  padding-vertical: 5;
`;

const HeaderContainer = styled.View`
  padding-vertical: 5;
`;

interface SectionProps {
  title: string;
  selected: boolean;
}

const SectionHeader: React.FunctionComponent<SectionProps> = ({
  title,
  selected,
}: SectionProps) => (
  <HeaderContainer key={title}>
    <Header selected={selected}>{title}</Header>
  </HeaderContainer>
);

interface ListItemProps {
  title: string;
  kind: string;
  selected: boolean;
  onPress: () => void;
}

const ItemTouchable: typeof TouchableOpacity = styled.TouchableOpacity`
  padding-horizontal: 16;
  padding-vertical: 5;
`;

const ListItem: React.FunctionComponent<ListItemProps> = ({ kind, title, selected, onPress }) => (
  <ItemTouchable
    key={title}
    onPress={onPress}
    activeOpacity={0.8}
    testID={`Storybook.ListItem.${kind}.${title}`}
    accessibilityLabel={`Storybook.ListItem.${title}`}
  >
    <Name selected={selected}>{title}</Name>
  </ItemTouchable>
);

interface Props {
  stories: any;
}

interface State {
  data: any[];
  originalData: any[];
}

const List: typeof SectionList = styled.SectionList`
  flex: 1;
  margin-bottom: 40;
`;
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
    channel.on(Events.SELECT_STORY, this.forceReRender);
    this.handleStoryAdded();
  }

  componentWillUnmount() {
    const channel = addons.getChannel();
    channel.removeListener(Events.STORY_ADDED, this.handleStoryAdded);
    channel.removeListener(Events.SELECT_STORY, this.forceReRender);
  }

  forceReRender = () => {
    this.forceUpdate();
  };

  handleStoryAdded = () => {
    const { stories } = this.props;

    if (stories) {
      const data = Object.values(
        stories
          .raw()
          .reduce((acc: { [kind: string]: { title: string; data: any[] } }, story: any) => {
            acc[story.kind] = {
              title: story.kind,
              data: (acc[story.kind] ? acc[story.kind].data : []).concat(story),
            };

            return acc;
          }, {})
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

  changeStory(storyId: string) {
    const channel = addons.getChannel();
    channel.emit(Events.SET_CURRENT_STORY, { storyId });
  }

  render() {
    const selectedStory = this.props.stories.getSelection();
    const { data } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SearchBar
          testID="Storybook.ListView.SearchBar"
          clearButtonMode="while-editing"
          disableFullscreenUI
          onChangeText={this.handleChangeSearchText}
          placeholder="Filter"
          returnKeyType="search"
        />
        <List
          testID="Storybook.ListView"
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              kind={item.kind}
              selected={item.id === selectedStory.id}
              onPress={() => this.changeStory(item.id)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} selected={title === selectedStory.kind} />
          )}
          keyExtractor={(item, index) => item + index}
          sections={data}
          stickySectionHeadersEnabled={false}
        />
      </SafeAreaView>
    );
  }
}
