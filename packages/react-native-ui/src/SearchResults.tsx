import { styled } from '@storybook/react-native-theming';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import React, { useCallback } from 'react';
import { transparentize } from 'polished';
import {
  isExpandType,
  IconButton,
  type GetSearchItemProps,
  type SearchResult,
  type SearchResultProps,
  Button,
} from '@storybook/react-native-ui-common';

import { PressableProps, View } from 'react-native';

import { ComponentIcon } from './icon/ComponentIcon';
import { StoryIcon } from './icon/StoryIcon';

// Microfuzz highlight types
type HighlightRange = [number, number];
type HighlightRanges = HighlightRange[];

const ResultsList = styled.View({
  margin: 0,
  padding: 0,
  marginTop: 8,
});

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
  textAlign: 'center',
  fontSize: theme.typography.size.s2,
  lineHeight: 18,
  color: theme.color.defaultText,
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

  // matches[0] = name highlights, matches[1] = path highlights (as joined string)
  const nameHighlights = matches?.[0];
  const pathString = item.path?.join(' ') ?? '';

  return (
    <ResultRow {...props} onPress={press}>
      <IconWrapper>
        {item.type === 'component' && <ComponentIcon width="14" height="14" />}
        {item.type === 'story' && <StoryIcon width="14" height="14" />}
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
  const handleClearLastViewed = () => {
    clearLastViewed();
    closeMenu();
  };

  return (
    <ResultsList>
      {results.length > 0 && !query ? (
        <RecentlyOpenedTitle>
          <Text>Recently opened</Text>
          <IconButton onPress={handleClearLastViewed} />
        </RecentlyOpenedTitle>
      ) : null}

      {results.length === 0 && query ? (
        <View>
          <NoResults>
            <Text style={{ marginBottom: 8 }}>No components found</Text>
            <Text>Find components by name or path.</Text>
          </NoResults>
        </View>
      ) : null}

      {results.map((result, index) => {
        if (isExpandType(result)) {
          return (
            <MoreWrapper key="search-result-expand">
              <Button
                {...result}
                {...getItemProps({ key: `${index}`, index, item: result })}
                size="small"
                text={`Show ${result.moreCount} more results`}
              />
            </MoreWrapper>
          );
        }

        const { item } = result;
        const key = `${item.refId}::${item.id}`;
        return (
          <Result
            {...result}
            {...getItemProps({ key, index, item: result })}
            isHighlighted={highlightedIndex === index}
            key={item.id}
          />
        );
      })}
    </ResultsList>
  );
});
