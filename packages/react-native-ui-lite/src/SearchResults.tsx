import { LegendList } from '@legendapp/list';
import { styled } from '@storybook/react-native-theming';
import type {
  GetSearchItemProps,
  SearchResult,
  SearchResultProps,
} from '@storybook/react-native-ui-common';
import { Button, IconButton, isExpandType, ExpandType } from '@storybook/react-native-ui-common';
import { FuseResultMatch } from 'fuse.js';
import { transparentize } from 'polished';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import React, { useCallback, useMemo } from 'react';
import { PressableProps, View, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ComponentIcon, StoryIcon } from './icon/iconDataUris';

const pathGroupStyle: ViewStyle = { flexShrink: 1 };
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
    minHeight: 28,
    borderRadius: 4,
    gap: 6,
    paddingTop: 7,
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
  minHeight: 28,
  // letterSpacing: '0.16em', <-- todo
  textTransform: 'uppercase',
  color: theme.textMutedColor,
  marginTop: 16,
  marginBottom: 4,
  alignItems: 'center',
}));

const Highlight: FC<PropsWithChildren<{ match?: FuseResultMatch }>> = React.memo(
  function Highlight({ children, match }) {
    if (!match) return children;
    const { value, indices } = match;

    const { nodes: result } = indices.reduce<{ cursor: number; nodes: ReactNode[] }>(
      ({ cursor, nodes }, [start, end], index, { length }) => {
        nodes.push(<Text key={`text-${index}`}>{value.slice(cursor, start)}</Text>);
        nodes.push(<Mark key={`mark-${index}`}>{value.slice(start, end + 1)}</Mark>);
        if (index === length - 1) {
          nodes.push(<Text key={`last-${index}`}>{value.slice(end + 1)}</Text>);
        }
        return { cursor: end + 1, nodes };
      },
      { cursor: 0, nodes: [] }
    );
    return <Text key={`end-${match.key}`}>{result}</Text>;
  }
);

const Title = styled.Text(({ theme }) => ({
  justifyContent: 'flex-start',
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s2,
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
  const press: PressableProps['onPress'] = useCallback(
    (event) => {
      event.preventDefault();
      onPress?.(event);
    },
    [onPress]
  );

  const nameMatch = matches.find((match: FuseResultMatch) => match.key === 'name');
  const pathMatches = matches.filter((match: FuseResultMatch) => match.key === 'path');

  return (
    <ResultRow {...props} onPress={press}>
      <IconWrapper>
        {item.type === 'component' && <ComponentIcon width={14} height={14} />}
        {item.type === 'story' && <StoryIcon width={14} height={14} />}
      </IconWrapper>
      <ResultRowContent testID="search-result-item--label">
        <Title>
          <Highlight key="search-result-item--label-highlight" match={nameMatch}>
            {item.name}
          </Highlight>
        </Title>
        <Path>
          {item.path.map((group, index) => {
            const pathSeparator = index === item.path.length - 1 ? '' : '/';
            return (
              <View key={index} style={pathGroupStyle}>
                <PathText>
                  <Highlight
                    match={pathMatches.find((match: FuseResultMatch) => match.refIndex === index)}
                  >
                    {`${group}${pathSeparator}`}
                  </Highlight>
                </PathText>
              </View>
            );
          })}
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
              <IconButton onPress={listItem.clearLastViewed} />
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
      />
    </View>
  );
});
