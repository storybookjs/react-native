import React, { Component, FunctionComponent } from 'react';
import { SafeAreaView } from 'react-native';
import styled from '@emotion/native';
import Events from '@storybook/core-events';
import addons from '@storybook/addons';
import { Header, Name } from '../Shared/text';

const SearchBar = styled.TextInput(
  {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    fontSize: 16,
    marginHorizontal: 5,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  ({ theme }) => ({
    backgroundColor: theme.borderColor,
    color: theme.buttonActiveTextColor,
  })
);

const HeaderContainer = styled.View({
  paddingVertical: 5,
});

interface SectionProps {
  title: string;
  selected: boolean;
}

const SectionHeader: FunctionComponent<SectionProps> = ({ title, selected }: SectionProps) => (
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

const ItemTouchable = styled.TouchableOpacity({
  paddingHorizontal: 16,
  paddingVertical: 5,
});

const ListItem: FunctionComponent<ListItemProps> = ({ kind, title, selected, onPress }) => (
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

const List = styled.SectionList({
  flex: 1,
  marginBottom: 40,
});

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
    const { stories } = this.props;
    const { storyId } = stories.getSelection();
    const selectedStory = stories.fromId(storyId);
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
              selected={selectedStory && item.id === selectedStory.id}
              onPress={() => this.changeStory(item.id)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} selected={selectedStory && title === selectedStory.kind} />
          )}
          keyExtractor={(item, index) => item + index}
          sections={data}
          stickySectionHeadersEnabled={false}
        />
      </SafeAreaView>
    );
  }
}
