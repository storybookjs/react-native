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

import { FuseResultMatch } from 'fuse.js';
import { PressableProps, View } from 'react-native';

import { ComponentIcon } from './icon/ComponentIcon';
import { StoryIcon } from './icon/StoryIcon';

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
        {item.type === 'component' && <ComponentIcon width="14" height="14" />}
        {item.type === 'story' && <StoryIcon width="14" height="14" />}
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
              <View key={index} style={{ flexShrink: 1 }}>
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
