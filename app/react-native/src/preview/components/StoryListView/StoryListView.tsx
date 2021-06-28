import styled from '@emotion/native';
import { addons, StoryKind } from '@storybook/addons';
import { StoryStore, StoreItem, PublishedStoreItem } from '@storybook/client-api';
import Events from '@storybook/core-events';
import React, { Component, FunctionComponent } from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { Header, Name } from '../Shared/text';

const SearchBar = styled.TextInput(
  {
    borderRadius: 4,
    fontSize: 16,
    margin: 5,
    padding: 5,
  },
  ({ theme }) => ({
    backgroundColor: theme.borderColor,
    color: theme.buttonActiveTextColor,
  })
);

const HeaderContainer = styled.View({
  paddingVertical: 5,
  paddingHorizontal: 5,
});

const StoryListContainer = styled.View({
  top: 0,
  ...StyleSheet.absoluteFillObject,

  // for this to work I need to get the top margin from safeareview context
  // shadowColor: '#000',
  // shadowOffset: {
  //   width: 0,
  //   height: 1,
  // },
  // shadowOpacity: 0.2,
  // shadowRadius: 1.41,
  // elevation: 2,

  borderRightWidth: StyleSheet.hairlineWidth,
  borderRightColor: 'lightgrey',
  backgroundColor: 'white',
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
  storyStore: StoryStore;
  selectedStory: StoreItem;
}

interface DataItem {
  title: StoryKind;
  data: PublishedStoreItem[];
}

interface State {
  data: DataItem[];
  originalData: DataItem[];
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
    this.handleStoryAdded();
  }

  handleStoryAdded = () => {
    const { storyStore } = this.props;

    if (storyStore) {
      const data = Object.values(
        storyStore
          .raw()
          .reduce(
            (
              acc: {
                [kind: string]: { title: string; data: PublishedStoreItem[] };
              },
              story: PublishedStoreItem
            ) => {
              acc[story.kind] = {
                title: story.kind,
                data: (acc[story.kind] ? acc[story.kind].data : []).concat(story),
              };

              return acc;
            },
            {}
          )
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
      const hasKind = story.data.some((ref) => checkValue(ref.name));

      if (hasTitle || hasKind) {
        acc.push({
          ...story,
          // in case the query matches component's title, all of its stories will be shown
          data: !hasTitle ? story.data.filter((ref) => checkValue(ref.name)) : story.data,
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
    const { selectedStory } = this.props;

    const { data } = this.state;

    return (
      <StoryListContainer>
        <SearchBar
          testID="Storybook.ListView.SearchBar"
          clearButtonMode="while-editing"
          disableFullscreenUI
          onChangeText={this.handleChangeSearchText}
          placeholder="Filter"
          returnKeyType="search"
        />
        <SectionList
          style={styles.sectionList}
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
          keyExtractor={(item, index) => item.id + index}
          sections={data}
          stickySectionHeadersEnabled={false}
        />
      </StoryListContainer>
    );
  }
}

const styles = StyleSheet.create({
  sectionList: { flex: 1, marginBottom: 40 },
});
