import styled from '@emotion/native';
import { addons, StoryKind } from '@storybook/addons';
import { StoryIndex, StoryIndexEntry } from '@storybook/client-api';
import Events from '@storybook/core-events';
import React, { useMemo, useState } from 'react';
import { SectionList, SectionListRenderItem, StyleSheet, TextInputProps } from 'react-native';
import { Icon } from '../Shared/icons';
import { Box } from '../Shared/layout';
import { useIsStorySelected, useIsStorySectionSelected, useTheme } from '../../../hooks';

const SectionHeaderText = styled.Text<{ selected: boolean }>(({ theme }) => ({
  fontSize: theme.storyList.fontSize,
  color: theme.storyList.headerTextColor,
  fontWeight: theme.storyList.headerFontWeight,
}));

const StoryNameText = styled.Text<{ selected: boolean }>(({ selected, theme }) => ({
  fontSize: theme.storyList.fontSize,
  fontWeight: selected ? theme.storyList.storySelectedFontWeight : theme.storyList.storyFontWeight,
  color: selected ? theme.storyList.storySelectedTextColor : theme.storyList.storyTextColor,
}));

const SEARCH_ICON_SIZE = 24;

const SearchInput = styled.TextInput(
  {
    padding: 0,
    ...StyleSheet.absoluteFillObject,
  },
  ({ theme }) => ({
    fontSize: theme.storyList.search.fontSize,
    paddingStart: theme.storyList.search.paddingHorizontal + SEARCH_ICON_SIZE,
    color: theme.storyList.search.textColor,
  })
);

const SearchContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  margin: theme.panel.paddingHorizontal,
  paddingVertical: theme.storyList.search.paddingVertical,
  paddingStart: theme.storyList.search.paddingHorizontal,
  borderColor: theme.storyList.search.borderColor,
  borderWidth: theme.storyList.search.borderWidth,
  borderRadius: theme.storyList.search.borderRadius,
  backgroundColor: theme.storyList.search.backgroundColor,
}));

const SearchBar = (props: TextInputProps) => {
  const theme = useTheme();
  return (
    <SearchContainer>
      <Icon name="search" opacity={0.5} />
      <SearchInput
        {...props}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        spellCheck={false}
        clearButtonMode="while-editing"
        disableFullscreenUI
        placeholderTextColor={theme.storyList.search.placeholderTextColor}
        returnKeyType="search"
      />
    </SearchContainer>
  );
};

const HeaderContainer = styled.TouchableOpacity(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ({ selected, theme }) => ({
    marginTop: theme.storyList.sectionSpacing,
    paddingHorizontal: theme.storyList.headerPaddingHorizontal,
    paddingVertical: theme.storyList.headerPaddingVertical,
    backgroundColor: selected ? theme.storyList.sectionActiveBackgroundColor : undefined,
    borderTopLeftRadius: theme.storyList.sectionBorderRadius,
    borderTopRightRadius: theme.storyList.sectionBorderRadius,
  })
);

interface SectionProps {
  title: string;
  onPress: () => void;
}

const SectionHeader = React.memo(({ title, onPress }: SectionProps) => {
  const selected = useIsStorySectionSelected(title);
  return (
    <HeaderContainer key={title} selected={selected} onPress={onPress} activeOpacity={0.8}>
      <Icon name="grid" width={10} height={10} marginRight={6} />
      <SectionHeaderText selected={selected}>{title}</SectionHeaderText>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  ({ selected, sectionSelected, isLastItem, theme }) => ({
    padding: theme.storyList.storyPaddingHorizontal,
    paddingStart: theme.storyList.storyIndent,
    backgroundColor: selected
      ? theme.storyList.storySelectedBackgroundColor
      : sectionSelected
      ? theme.storyList.sectionActiveBackgroundColor
      : undefined,
    borderBottomLeftRadius: isLastItem ? theme.storyList.sectionBorderRadius : undefined,
    borderBottomRightRadius: isLastItem ? theme.storyList.sectionBorderRadius : undefined,
  })
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
        <Icon name={selected ? 'story-white' : 'story-blue'} marginRight={6} />
        <StoryNameText selected={selected}>{title}</StoryNameText>
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
  const theme = useTheme();

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
    <Box flex>
      <SearchBar
        testID="Storybook.ListView.SearchBar"
        onChangeText={handleChangeSearchText}
        placeholder="Find by name"
      />
      <SectionList
        style={styles.sectionList}
        contentContainerStyle={[
          styles.sectionListContentContainer,
          {
            paddingVertical: theme.panel.paddingVertical,
            paddingHorizontal: theme.panel.paddingHorizontal,
          },
        ]}
        testID="Storybook.ListView"
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        sections={data}
        stickySectionHeadersEnabled={false}
      />
    </Box>
  );
};

export default React.memo(StoryListView);
