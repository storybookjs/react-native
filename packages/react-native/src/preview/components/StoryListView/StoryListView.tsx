import { addons } from '@storybook/addons';
import { StoryIndex } from '@storybook/client-api';
import Events from '@storybook/core-events';
import { styled, useTheme } from '@storybook/react-native-theming';
import React, { useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, TextInputProps, View } from 'react-native';
import { useIsChildSelected, useIsStorySectionSelected, useIsStorySelected } from '../../../hooks';
import { Icon } from '../Shared/icons';
import {
  StoryGroup,
  filterNestedStories,
  findFirstChildStory,
  getNestedStories,
} from './getNestedStories';

const SectionHeaderText = styled.Text<{ selected: boolean }>(({ theme }) => ({
  fontSize: theme.storyList.fontSize,
  color: theme.storyList.headerTextColor,
  fontWeight: theme.storyList.headerFontWeight,
  flexShrink: 1,
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
      <Icon name="search" style={{ opacity: 0.5 }} />

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

const HeaderContainer = styled.TouchableOpacity<{ selected: boolean; childSelected: boolean }>(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ({ selected, theme, childSelected }) => ({
    marginTop: theme.storyList.sectionSpacing,
    paddingHorizontal: theme.storyList.headerPaddingHorizontal,
    paddingVertical: theme.storyList.headerPaddingVertical,
    backgroundColor: selected ? theme.storyList.sectionActiveBackgroundColor : undefined,
    borderTopLeftRadius: theme.storyList.sectionBorderRadius,
    borderTopRightRadius: theme.storyList.sectionBorderRadius,
    borderBottomLeftRadius:
      selected && !childSelected ? theme.storyList.sectionBorderRadius : undefined,
    borderBottomRightRadius:
      selected && !childSelected ? theme.storyList.sectionBorderRadius : undefined,
  })
);

interface SectionProps {
  name: string;
  onPress: () => void;
  isChildSelected: boolean;
  icon: 'grid' | 'folder';
  expanded: boolean;
}

const SectionHeader = React.memo(
  ({ name, onPress, isChildSelected, icon = 'grid', expanded }: SectionProps) => {
    const selected = useIsStorySectionSelected(name) || isChildSelected;

    return (
      <HeaderContainer
        key={name}
        selected={selected}
        childSelected={isChildSelected}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View
          style={{
            transform: [{ rotate: expanded ? '90deg' : '0deg' }],
            marginRight: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 8, color: 'grey', lineHeight: 8 }}>{'➤'}</Text>
        </View>

        <Icon name={icon} width={12} height={12} style={{ marginRight: 6 }} />

        <SectionHeaderText numberOfLines={2} selected={selected}>
          {name}
        </SectionHeaderText>
      </HeaderContainer>
    );
  }
);

interface ListItemProps {
  storyId: string;
  title: string;
  kind: string;
  isSiblingSelected: boolean;
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

const ListItem = ({
  storyId,
  kind,
  title,
  isLastItem,
  onPress,
  isSiblingSelected,
}: ListItemProps) => {
  const selected = useIsStorySelected(storyId);

  const sectionSelected = useIsStorySectionSelected(kind) || isSiblingSelected;

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
      <Icon
        width={14}
        height={14}
        name={selected ? 'story-white' : 'story-blue'}
        style={{ marginRight: 6 }}
      />

      <StoryNameText selected={selected}>{title}</StoryNameText>
    </ItemTouchable>
  );
};

interface Props {
  storyIndex: StoryIndex;
}

const styles = StyleSheet.create({
  sectionList: { flex: 1 },
  sectionListContentContainer: { paddingBottom: 6 },
});

function keyExtractor(item: StoryGroup, index) {
  return item.name + index;
}

const RenderItem = ({
  item,
  changeStory,
}: {
  item: StoryGroup;
  changeStory: (id: string) => void;
}) => {
  const isChildSelected = useIsChildSelected(item.stories);

  const firstChild = findFirstChildStory(item);

  const firstChildSelected = useIsStorySelected(firstChild?.id);

  const [showChildren, setShowChildren] = useState(false);

  return (
    <>
      <SectionHeader
        name={item.name}
        isChildSelected={isChildSelected}
        onPress={() => {
          if (firstChildSelected && showChildren) {
            setShowChildren(false);
          } else if (!showChildren && firstChild) {
            setShowChildren(true);
            changeStory(firstChild.id);
          } else if (showChildren && !firstChildSelected && firstChild) {
            changeStory(firstChild.id);
          }
        }}
        icon={item.children.length ? 'folder' : 'grid'}
        expanded={showChildren}
      />

      {showChildren &&
        item.stories?.map((story, idx) => (
          <ListItem
            key={story.id}
            storyId={story.id}
            title={story.name}
            kind={item.name}
            isSiblingSelected={isChildSelected}
            isLastItem={idx === item.stories.length - 1}
            onPress={() => changeStory(story.id)}
          />
        ))}

      {showChildren &&
        item.children?.map((child, idx) => (
          <View key={`${child.title}-${idx}`} style={{ marginLeft: 16 }}>
            <RenderItem item={child} changeStory={changeStory} />
          </View>
        ))}
    </>
  );
};

const StoryListView = ({ storyIndex }: Props) => {
  const originalData = useMemo(() => getNestedStories(storyIndex), [storyIndex]);

  const [data, setData] = useState<StoryGroup[]>(originalData);

  const theme = useTheme();

  const handleChangeSearchText = (text: string) => {
    const query = text.trim();

    if (!query) {
      setData(originalData);

      return;
    }

    setData(filterNestedStories(originalData, query));
  };

  const changeStory = (storyId: string) => {
    const channel = addons.getChannel();

    channel.emit(Events.SET_CURRENT_STORY, { storyId });
  };

  const renderItem: ListRenderItem<StoryGroup> = React.useCallback(({ item }) => {
    return <RenderItem item={item} changeStory={changeStory} />;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        testID="Storybook.ListView.SearchBar"
        onChangeText={handleChangeSearchText}
        placeholder="Find by name"
      />

      <FlatList
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
        keyExtractor={keyExtractor}
        data={data}
      />
    </View>
  );
};

export default React.memo(StoryListView);
