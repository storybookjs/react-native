import { LegendList } from './LegendList';
import { styled, useTheme } from '@storybook/react-native-theming';
import type {
  GetSearchItemProps,
  SearchResult,
  SearchResultProps,
} from '@storybook/react-native-ui-common';
import { Button, IconButton, isExpandType, ExpandType } from '@storybook/react-native-ui-common';
import { transparentize } from 'polished';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import React, { useCallback, useMemo } from 'react';
import { PressableProps, View, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ComponentIcon, StoryIcon } from './icon/iconDataUris';

// Microfuzz highlight types
type HighlightRange = [number, number];
type HighlightRanges = HighlightRange[];

const noResultsFirstLineStyle: TextStyle = { marginBottom: 4 };
const flexStyle: ViewStyle = { flex: 1 };

type ListItemType =
  | { type: 'header'; clearLastViewed: () => void }
  | { type: 'noResults' }
  | { type: 'result'; result: SearchResult; index: number }
  | { type: 'expand'; result: ExpandType; index: number };

const ResultRow = styled.TouchableOpacity<{ isHighlighted: boolean }>(
  ({ theme, isHighlighted }) => ({
    width: '100%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'left',
    color: theme.color.defaultText,
    fontSize: theme.typography.size.s2,
    backgroundColor: isHighlighted ? theme.background.hoverable : 'transparent',
    minHeight: 34,
    borderRadius: 4,
    gap: 6,
    paddingTop: 8,
    paddingBottom: 7,
    paddingLeft: 8,
    paddingRight: 8,

    '&:hover, &:focus': {
      backgroundColor: transparentize(0.93, theme.color.secondary),
      outline: 'none',
    },
  })
);

const IconWrapper = styled.View({
  marginTop: 2,
});

const ResultRowContent = styled.View(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const NoResults = styled.View(({ theme }) => ({
  marginTop: 20,
  alignItems: 'center',
  fontSize: theme.typography.size.s2,
  lineHeight: 18,
  color: theme.color.defaultText,
}));

const NoResultsText = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  color: theme.textMutedColor,
  textAlign: 'center',
}));

const Mark = styled.Text(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.color.secondary,
}));

const MoreWrapper = styled.View({
  marginTop: 8,
});

const RecentlyOpenedTitle = styled.View(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  fontSize: theme.typography.size.s1 - 1,
  fontWeight: theme.typography.weight.bold,
  minHeight: 34,
  // letterSpacing: '0.16em', <-- todo
  textTransform: 'uppercase',
  color: theme.textMutedColor,
  marginTop: 16,
  marginBottom: 4,
  alignItems: 'center',
}));

// Highlight component using native microfuzz format
// ranges is an array of [start, end] tuples (end is inclusive in microfuzz)
const Highlight: FC<PropsWithChildren<{ text: string; ranges?: HighlightRanges }>> = React.memo(
  function Highlight({ children, text, ranges }) {
    if (!ranges || ranges.length === 0) return <Text>{children ?? text}</Text>;

    const { nodes: result } = ranges.reduce<{ cursor: number; nodes: ReactNode[] }>(
      ({ cursor, nodes }, [start, end], index, { length }) => {
        // Add text before the highlight
        if (cursor < start) {
          nodes.push(<Text key={`text-${index}`}>{text.slice(cursor, start)}</Text>);
        }
        // Add highlighted text (end is inclusive in microfuzz)
        nodes.push(<Mark key={`mark-${index}`}>{text.slice(start, end + 1)}</Mark>);
        // Add remaining text after last highlight
        if (index === length - 1 && end + 1 < text.length) {
          nodes.push(<Text key={`last-${index}`}>{text.slice(end + 1)}</Text>);
        }
        return { cursor: end + 1, nodes };
      },
      { cursor: 0, nodes: [] }
    );
    return <Text>{result}</Text>;
  }
);

const Title = styled.Text(({ theme }) => ({
  justifyContent: 'flex-start',
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s2 + 1,
}));

const Path = styled.View(({ theme }) => ({
  justifyContent: 'flex-start',
  marginVertical: 2,
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s1 - 1,
  flexDirection: 'row',
}));

const PathText = styled.Text(({ theme }) => ({
  fontSize: theme.typography.size.s1 - 1,
  color: theme.textMutedColor,
}));

const Result: FC<SearchResultProps> = React.memo(function Result({
  item,
  matches,
  icon: _icon,
  onPress,
  ...props
}) {
  const theme = useTheme();
  const press: PressableProps['onPress'] = useCallback(
    (event) => {
      event.preventDefault();
      onPress?.(event);
    },
    [onPress]
  );

  // matches[0] = name highlights, matches[1] = path highlights (as joined string)
  const nameHighlights = matches?.[0];
  const pathString = item.path?.join(' ') ?? '';

  return (
    <ResultRow
      {...props}
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.path?.join(' / ') ?? ''}`}
    >
      <IconWrapper>
        {item.type === 'component' && (
          <ComponentIcon width={14} height={14} color={theme.color.secondary} />
        )}
        {item.type === 'story' && <StoryIcon width={14} height={14} color={theme.color.seafoam} />}
      </IconWrapper>
      <ResultRowContent testID="search-result-item--label">
        <Title>
          <Highlight text={item.name} ranges={nameHighlights}>
            {item.name}
          </Highlight>
        </Title>
        <Path>
          <PathText>
            <Highlight text={pathString} ranges={matches?.[1]}>
              {item.path?.join(' / ')}
            </Highlight>
          </PathText>
        </Path>
      </ResultRowContent>
    </ResultRow>
  );
});

const Text = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
}));

export const SearchResults: FC<{
  query: string;
  results: SearchResult[];
  closeMenu: (cb?: () => void) => void;
  getItemProps: GetSearchItemProps;
  highlightedIndex: number | null;
  isLoading?: boolean;
  enableShortcuts?: boolean;
  clearLastViewed?: () => void;
}> = React.memo(function SearchResults({
  query,
  results,
  closeMenu,
  getItemProps,
  highlightedIndex,
  clearLastViewed,
}) {
  const insets = useSafeAreaInsets();

  const handleClearLastViewed = useCallback(() => {
    clearLastViewed();
    closeMenu();
  }, [clearLastViewed, closeMenu]);

  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: 10,
      paddingTop: 8,
      paddingBottom: insets.bottom + 20,
    }),
    [insets.bottom]
  );

  const listData = useMemo<ListItemType[]>(() => {
    const items: ListItemType[] = [];

    // Add header for recently opened
    if (results.length > 0 && !query) {
      items.push({ type: 'header', clearLastViewed: handleClearLastViewed });
    }

    // Add no results message
    if (results.length === 0 && query) {
      items.push({ type: 'noResults' });
    }

    // Add results
    results.forEach((result, index) => {
      if (isExpandType(result)) {
        items.push({ type: 'expand', result: result as unknown as ExpandType, index });
      } else {
        items.push({ type: 'result', result, index });
      }
    });

    return items;
  }, [results, query, handleClearLastViewed]);

  const keyExtractor = useCallback((item: ListItemType) => {
    switch (item.type) {
      case 'header':
        return 'header';
      case 'noResults':
        return 'no-results';
      case 'expand':
        return 'expand';
      case 'result': {
        const { item: resultItem } = item.result as { item: { refId: string; id: string } };
        return `${resultItem.refId}::${resultItem.id}`;
      }
    }
  }, []);

  const renderItem = useCallback(
    ({ item: listItem }: { item: ListItemType }) => {
      switch (listItem.type) {
        case 'header':
          return (
            <RecentlyOpenedTitle>
              <Text>Recently opened</Text>
              <IconButton
                onPress={listItem.clearLastViewed}
                accessibilityLabel="Clear recently opened"
              />
            </RecentlyOpenedTitle>
          );
        case 'noResults':
          return (
            <NoResults>
              <NoResultsText style={noResultsFirstLineStyle}>No components found</NoResultsText>
              <NoResultsText>Find components by name or path.</NoResultsText>
            </NoResults>
          );
        case 'expand': {
          return (
            <MoreWrapper>
              <Button
                {...listItem.result}
                {...getItemProps({
                  key: `${listItem.index}`,
                  index: listItem.index,
                  item: listItem.result as unknown as SearchResult,
                })}
                size="small"
                text={`Show ${listItem.result.moreCount} more results`}
              />
            </MoreWrapper>
          );
        }
        case 'result': {
          const { item: resultItem } = listItem.result as { item: { refId: string; id: string } };
          const key = `${resultItem.refId}::${resultItem.id}`;
          return (
            <Result
              {...listItem.result}
              {...getItemProps({ key, index: listItem.index, item: listItem.result })}
              isHighlighted={highlightedIndex === listItem.index}
            />
          );
        }
      }
    },
    [getItemProps, highlightedIndex]
  );

  return (
    <View style={flexStyle}>
      <LegendList
        style={flexStyle}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        estimatedItemSize={50}
        keyboardShouldPersistTaps="handled"
        recycleItems
      />
    </View>
  );
});
