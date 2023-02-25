import styled from '@emotion/native';
import { addons, StoryKind } from '@storybook/addons';
import { StoryIndex, StoryIndexEntry } from '@storybook/client-api';
import Events from '@storybook/core-events';
import React, { useMemo, useState } from 'react';
import { SectionList, SectionListRenderItem, StyleSheet, TextInputProps } from 'react-native';
import { useIsStorySectionSelected, useIsStorySelected } from '../../../hooks';
import { GridIcon, SearchIcon, StoryIcon } from '../Shared/icons';
import { Header, Name } from '../Shared/text';

const SearchInput = styled.TextInput(
  {
    fontSize: 16,
    padding: 0,
    paddingHorizontal: 36,
    ...StyleSheet.absoluteFillObject,
  },
  ({ theme }) => ({
    color: theme.buttonActiveTextColor,
  })
);

const SearchContainer = styled.View(
  {
    borderRadius: 100,
    borderWidth: 1.5,
    marginVertical: 4,
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ({ theme }) => ({
    borderColor: theme.borderColor,
    backgroundColor: theme.storyListBackgroundColor,
  })
);

const SearchBar = (props: TextInputProps) => {
  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput
        {...props}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        spellCheck={false}
        clearButtonMode="while-editing"
        disableFullscreenUI
        placeholderTextColor="#666"
        returnKeyType="search"
      />
    </SearchContainer>
  );
};

const HeaderContainer = styled.TouchableOpacity(
  {
    marginTop: 8,
    marginHorizontal: 6,
    padding: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ({ selected, theme }) => ({
    backgroundColor: selected ? theme.sectionActiveColor : undefined,
  })
);

const StoryListContainer = styled.View(({ theme }) => ({
  flex: 1,
  borderRightWidth: StyleSheet.hairlineWidth,
  borderRightColor: theme.borderColor,
  backgroundColor: theme.storyListBackgroundColor,
}));

interface SectionProps {
  title: string;
  onPress: () => void;
}

const SectionHeader = React.memo(({ title, onPress }: SectionProps) => {
  const selected = useIsStorySectionSelected(title);
  return (
    <HeaderContainer key={title} selected={selected} onPress={onPress} activeOpacity={0.8}>
      <GridIcon />
      <Header selected={selected}>{title}</Header>
    </HeaderContainer>
  );
});

interface ListItemProps {
  storyId: string;
  title: string;
  kind: string;
  onPress: () => void;
  isLastItem: boolean;
}

const ItemTouchable = styled.TouchableOpacity<{
  selected: boolean;
  sectionSelected: boolean;
  isLastItem: boolean;
}>(
  {
    marginHorizontal: 6,
    padding: 6,
    paddingLeft: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ({ selected, sectionSelected, isLastItem, theme }) => {
    return {
      backgroundColor: selected
        ? theme?.listItemActiveColor ?? '#1ea7fd'
        : sectionSelected
        ? theme?.sectionActiveColor
        : undefined,
      borderBottomLeftRadius: isLastItem ? 6 : undefined,
      borderBottomRightRadius: isLastItem ? 6 : undefined,
    };
  }
);

const ListItem = React.memo(
  ({ storyId, kind, title, isLastItem, onPress }: ListItemProps) => {
    const selected = useIsStorySelected(storyId);
    const sectionSelected = useIsStorySectionSelected(kind);
    return (
      <ItemTouchable
        key={title}
        onPress={onPress}
        activeOpacity={0.8}
        testID={`Storybook.ListItem.${kind}.${title}`}
        accessibilityLabel={`Storybook.ListItem.${title}`}
        selected={selected}
        sectionSelected={sectionSelected}
        isLastItem={isLastItem}
      >
        <StoryIcon selected={selected} />
        <Name selected={selected}>{title}</Name>
      </ItemTouchable>
    );
  },
  (prevProps, nextProps) => prevProps.storyId === nextProps.storyId
);

interface Props {
  storyIndex: StoryIndex;
}

interface DataItem {
  title: StoryKind;
  data: StoryIndexEntry[];
}

const getStories = (storyIndex: StoryIndex): DataItem[] => {
  if (!storyIndex) {
    return [];
  }

  const groupedStories = Object.values(storyIndex.stories).reduce((acc, story) => {
    acc[story.title] = {
      title: story.title,
      data: (acc[story.title]?.data ?? []).concat(story),
    };
    return acc;
  }, {} as Record<string, DataItem>);

  return Object.values(groupedStories);
};

const styles = StyleSheet.create({
  sectionList: { flex: 1 },
  sectionListContentContainer: { paddingBottom: 6 },
});

function keyExtractor(item: any, index) {
  return item.id + index;
}

const StoryListView = ({ storyIndex }: Props) => {
  const originalData = useMemo(() => getStories(storyIndex), [storyIndex]);
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

  const renderItem: SectionListRenderItem<StoryIndexEntry, DataItem> = React.useCallback(
    ({ item, index, section }) => {
      return (
        <ListItem
          storyId={item.id}
          title={item.name}
          kind={item.title}
          isLastItem={index === section.data.length - 1}
          onPress={() => changeStory(item.id)}
        />
      );
    },
    []
  );

  const renderSectionHeader = React.useCallback(
    ({ section: { title, data } }) => (
      <SectionHeader title={title} onPress={() => changeStory(data[0].id)} />
    ),
    []
  );

  return (
    <StoryListContainer>
      <SearchBar
        testID="Storybook.ListView.SearchBar"
        onChangeText={handleChangeSearchText}
        placeholder="Find by name"
      />
      <SectionList
        style={styles.sectionList}
        contentContainerStyle={styles.sectionListContentContainer}
        testID="Storybook.ListView"
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        sections={data}
        stickySectionHeadersEnabled={false}
      />
    </StoryListContainer>
  );
};

export default React.memo(StoryListView);
