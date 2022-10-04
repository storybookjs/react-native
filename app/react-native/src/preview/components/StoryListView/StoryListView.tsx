import styled from '@emotion/native';
import { addons, StoryKind } from '@storybook/addons';
import { PublishedStoreItem, StoreItem, StoryStore } from '@storybook/client-api';
import Events from '@storybook/core-events';
import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GridIcon, StoryIcon } from '../Shared/icons';
import { Header, Name } from '../Shared/text';

const SearchBar = styled.TextInput(
  {
    borderRadius: 16,
    borderWidth: 2,
    fontSize: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  ({ theme }) => ({
    borderColor: theme.borderColor,
    color: theme.buttonActiveTextColor,
  })
);

const HeaderContainer = styled.View({
  paddingVertical: 5,
  paddingHorizontal: 5,
  flexDirection: 'row',
  alignItems: 'center',
});

const StoryListContainer = styled.View(({ theme }) => ({
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
  borderRightColor: theme.borderColor,
  backgroundColor: theme.storyListBackgroundColor,
}));

interface SectionProps {
  title: string;
  selected: boolean;
}

const SectionHeader = React.memo(
  ({ title, selected }: SectionProps) => (
    <HeaderContainer key={title}>
      <GridIcon />
      <Header selected={selected}>{title}</Header>
    </HeaderContainer>
  ));

interface ListItemProps {
  title: string;
  kind: string;
  selected: boolean;
  onPress: () => void;
}

const ItemTouchable = styled.TouchableOpacity<{ selected: boolean }>(
  {
    padding: 5,
    paddingLeft: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ({ selected, theme }) => (selected ? { backgroundColor: theme.listItemActiveColor } : {})
);

const ListItem = React.memo(
  ({ kind, title, selected, onPress }: ListItemProps) => (
    <ItemTouchable
      key={title}
      onPress={onPress}
      activeOpacity={0.8}
      testID={`Storybook.ListItem.${kind}.${title}`}
      accessibilityLabel={`Storybook.ListItem.${title}`}
      selected={selected}
    >
      <StoryIcon selected={selected} />
      <Name selected={selected}>{title}</Name>
    </ItemTouchable>
  ),
  (prevProps, nextProps) => prevProps.selected === nextProps.selected
);

interface Props {
  storyStore: StoryStore;
  selectedStory: StoreItem;
}

interface DataItem {
  title: StoryKind;
  data: PublishedStoreItem[];
}

const getStories = (storyStore: StoryStore): DataItem[] => {
  if (!storyStore) {
    return [];
  }

  return Object.values(
    storyStore
      .raw()
      .reduce(
        (
          acc: { [kind: string]: { title: string; data: PublishedStoreItem[] } },
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
};

const styles = StyleSheet.create({
  sectionList: { flex: 1 },
});

const tabBarHeight = 40;

const StoryListView = ({ selectedStory, storyStore }: Props) => {
  const insets = useSafeAreaInsets();
  const originalData = useMemo(() => getStories(storyStore), [storyStore]);
  const [data, setData] = useState<DataItem[]>(originalData);

  const handleChangeSearchText = (text: string) => {
    const query = text.trim();

    if (!query) {
      setData(originalData);
      return;
    }

    const checkValue = (value: string) => value.toLowerCase().includes(query.toLowerCase());
    const filteredData = originalData.reduce((acc, story) => {
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

    setData(filteredData);
  };

  const changeStory = (storyId: string) => {
    const channel = addons.getChannel();
    channel.emit(Events.SET_CURRENT_STORY, { storyId });
  };

  const safeStyle = { flex: 1, marginTop: insets.top, paddingBottom: insets.bottom + tabBarHeight };

  return (
    <StoryListContainer>
      <View style={safeStyle}>
        <SearchBar
          testID="Storybook.ListView.SearchBar"
          clearButtonMode="while-editing"
          disableFullscreenUI
          onChangeText={handleChangeSearchText}
          placeholder="Filter"
          returnKeyType="search"
        />
        <SectionList
          // contentInset={{ bottom: insets.bottom, top: 0 }}
          style={styles.sectionList}
          testID="Storybook.ListView"
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              kind={item.kind}
              selected={selectedStory && item.id === selectedStory.id}
              onPress={() => changeStory(item.id)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} selected={selectedStory && title === selectedStory.kind} />
          )}
          keyExtractor={(item, index) => item.id + index}
          sections={data}
          stickySectionHeadersEnabled={false}
        />
      </View>
    </StoryListContainer>
  );
};

export default StoryListView;
