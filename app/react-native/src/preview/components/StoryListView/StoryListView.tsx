import styled from '@emotion/native';
import { addons, StoryKind } from '@storybook/addons';
import { StoryIndex, StoryIndexEntry } from '@storybook/client-api';
import Events from '@storybook/core-events';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, FlatList, StyleSheet, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Icon } from '../Shared/icons';
import { Box } from '../Shared/layout';
import { useIsStorySelected, useTheme } from '../../../hooks';
import { Theme } from '../Shared/theme';

const SectionHeaderText = styled.Text<{ selected: boolean }>(({ theme }) => ({
  fontSize: theme.storyList.fontSize,
  color: theme.storyList.headerTextColor,
  fontWeight: theme.storyList.headerFontWeight,
}));

const StoryNameText = styled.Text<{ selected: boolean }>(({ selected, theme }) => ({
  fontSize: theme.storyList.fontSize,
  fontWeight: selected ? theme.storyList.storySelectedFontWeight : theme.storyList.storyFontWeight,
  color: selected ? theme.storyList.storySelectedTextColor : theme.storyList.storyTextColor,
  marginLeft: 5,
}));

const StoryItemView = styled.View(({selected, theme}: { selected: boolean, theme: Theme }) => ({
  backgroundColor: selected ? theme.storyList.storySelectedBackgroundColor : 'transparent',
  borderRadius: theme.storyList.sectionBorderRadius,
  marginRight: 10,
  marginLeft: 20,
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
      <Icon name="search" opacity={0.5} color={'white'} />
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

interface Props {
  storyIndex: StoryIndex;
}

type ItemType = 'Section' | 'Feature' | 'Story' | 'Item';

interface DataItem {
  title: StoryKind;
  type: ItemType;
  name?: string;
  data: (StoryIndexEntry & { type?: ItemType })[];
}

const getNestedStories = (storyIndex: StoryIndex): DataItem[] => {
  if (!storyIndex) {
    return [];
  }

  const groupedStories = Object.values(storyIndex.stories).reduce((acc, story) => {
    const splitTitle = story.title.split('/');

    if (splitTitle.length > 1) {
      const sectionTitle = splitTitle[0];
      const featureTitle = splitTitle[1];
      const storyTitle = splitTitle[2] || '';

      if (!acc[sectionTitle]) {
        acc[sectionTitle] = { title: sectionTitle, type: 'Section', data: [] };
      }

      const section = acc[sectionTitle].data.find((dataItem) => dataItem.id === featureTitle);

      if (!section) {
        acc[sectionTitle].data.push({
          id: featureTitle,
          title: featureTitle,
          type: 'Feature',
          data: [],
        } as any);
      }

      const updatedSection: any = acc[sectionTitle].data.find((dataItem) => dataItem.id === featureTitle);

      if (storyTitle) {
        const storyItem = updatedSection.data.find((dataItem) => dataItem.id === storyTitle);

        if (storyItem) {
          storyItem.data.push({ ...story, type: 'Item' });
        } else {
          updatedSection.data.push({
            id: storyTitle,
            title: storyTitle,
            type: 'Story',
            data: [{ ...story, type: 'Item' }],
          });
        }
      } else {
        updatedSection.data.push({ ...story, type: 'Item' });
      }
    } else {
      acc[story.title] = {
        title: story.title,
        type: 'Story',
        data: (acc[story.title]?.data ?? []).concat({ ...story, type: 'Item' }),
      };
    }

    return acc;
  }, {} as Record<string, DataItem>);

  return Object.values(groupedStories);
};

const StoryListView = ({ storyIndex }: Props) => {
  const newData = useMemo(() => getNestedStories(storyIndex), [storyIndex]);
  const [searchTerm, setSearchTerm] = useState('');

  let filteredData = newData;

  const searchQuery = searchTerm.toLowerCase().trim();

  const filterData = useCallback((items: DataItem[]): DataItem[] => {
    return items.reduce<DataItem[]>((filtered, item) => {
      const childData = item.data && item.type !== 'Item' ? filterData(item.data as any) : [];

      const matchesTitle = item.title.toLowerCase().includes(searchQuery);
      const matchesName = item.type === 'Item' && item.name && item.name.toLowerCase().includes(searchQuery);
      const hasMatchingChild = childData.length > 0;

      if (matchesTitle || matchesName || hasMatchingChild) {
        filtered.push({
          ...item,
          data: hasMatchingChild ? childData : item.data as any,
        });
      }

      return filtered;
    }, []);
  }, [searchQuery]);

  if (searchTerm && searchTerm.trim() && searchTerm.length > 0) {
    filteredData = filterData(newData);
  }

  const changeStory = (storyId: string) => {
    const channel = addons.getChannel();

    channel.emit(Events.SET_CURRENT_STORY, { storyId });
  };

  const LevelItem = React.memo(({ item, level, changeStory, expandedLevels, toggleExpand }: any) => {
    const marginLeft = level * 10;
    const selected = useIsStorySelected(item.id);

    if (item.type === 'Item') {
      return (
        <StoryItemView selected={selected}>
          <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10 }} onPress={() => changeStory( item.id)}>
            <Icon name={selected ? 'story-white' : 'story-blue'} />
            <StoryNameText selected={selected}>{item.name}</StoryNameText>
          </TouchableOpacity>
        </StoryItemView>
      );
    }

    const isExpanded = expandedLevels[level]?.includes(item.title);

    return (
      <TouchableOpacity onPress={() => toggleExpand(level, item.title, isExpanded)} style={{ marginLeft }}>
        <View style={{flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10}}>
          <Icon name="grid" />
          <SectionHeaderText style={{ marginLeft: 5 }}>
            {item.type === 'Item' ? item.name : item.title}
          </SectionHeaderText>
        </View>
        {isExpanded && item.data && (
          <View>
            {item.data.map((child, index) => (
              <LevelItem
                key={child.title + index}
                item={child}
                level={level + 1}
                changeStory={changeStory}
                expandedLevels={expandedLevels}
                toggleExpand={toggleExpand}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  });

  const RenderData = React.memo(({ newData, changeStory }: any) => {
    const [expandedLevels, setExpandedLevels] = useState({});


    const toggleAll = (expand) => {
      const updateLevels = (data, level = 0, prevState = {}) => {
        data.forEach((item) => {
          if (item.type !== 'Item' && item.data) {
            const expandedTitles = prevState[level] || [];
            const updatedTitles = expand
              ? [...expandedTitles, item.title]
              : expandedTitles.filter((t) => t !== item.title);

            prevState[level] = updatedTitles;
            updateLevels(item.data, level + 1, prevState);
          }
        });
        return prevState;
      };

      setExpandedLevels((prevState) => updateLevels(newData, 0, { ...prevState }));
    };

    const toggleExpand = (level, title, isExpanded) => {
      setExpandedLevels((prevState) => {
        const expandedTitles = prevState[level] || [];
        const updatedTitles = isExpanded
          ? expandedTitles.filter((t) => t !== title)
          : [...expandedTitles, title];
        return { ...prevState, [level]: updatedTitles };
      });
    };

    const flattenData = (data, level = 0) => {
      return data.reduce((flatData, item) => {
        flatData.push({ ...item, level });
        if (item.type !== 'Item' && item.data && expandedLevels[level]?.includes(item.title)) {
          flatData.push(...flattenData(item.data, level + 1));
        }
        return flatData;
      }, []);
    };

    const flatData = flattenData(newData);

    const renderItem = ({ item }) => (
      <LevelItem
        item={item}
        level={item.level}
        changeStory={changeStory}
        expandedLevels={expandedLevels}
        toggleExpand={toggleExpand}
      />
    );

    return (
      <>
        <View style={{ flexDirection: 'row' }}>
          <Button title="Expand All" onPress={() => toggleAll(true)} />
          <Button title="Collapse All" onPress={() => toggleAll(false)} />
        </View>
        <FlatList
          data={flatData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </>
    );
  });


  return (
    <Box flex>
      <SearchBar
        testID="Storybook.ListView.SearchBar"
        onChangeText={setSearchTerm}
        value={searchTerm}
        placeholder="Find by name"
      />
    <RenderData newData={filteredData} changeStory={changeStory} />
    </Box>
  );
};

export default React.memo(StoryListView);
