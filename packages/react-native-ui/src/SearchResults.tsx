import { styled } from '@storybook/react-native-theming';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import React, { useCallback } from 'react';
// import type { ControllerStateAndHelpers } from 'downshift';

// import { useStorybookApi } from '@storybook/manager-api';
// import { PRELOAD_ENTRIES } from '@storybook/core-events';
import { transparentize } from 'polished';
// import { TrashIcon } from '@storybook/icons';

import type { SearchResult } from './types';
import { isExpandType } from './types';

import { statusMapping } from './util/status';
import { ComponentIcon } from './icon/ComponentIcon';
import { StoryIcon } from './icon/StoryIcon';
import { PressableProps, Text, View } from 'react-native';
import { FuseResultMatch } from 'fuse.js';
import { IconButton } from './IconButton';
import { Button } from './Button';
// import { UseSymbol } from './IconSymbols';

const ResultsList = styled.View({
  margin: 0,
  padding: 0,
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
    color: 'inherit',
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
  // small: {
  //   color: theme.barTextColor,
  //   fontSize: theme.typography.size.s1,
  // },
}));

const Mark = styled.Text(({ theme }) => ({
  background: 'transparent',
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

  // '.search-result-recentlyOpened-clear': {
  //   visibility: 'hidden',
  // },

  // '&:hover': {
  //   '.search-result-recentlyOpened-clear': {
  //     visibility: 'visible',
  //   },
  // },
}));

const Highlight: FC<PropsWithChildren<{ match?: FuseResultMatch }>> = React.memo(
  function Highlight({ children, match }) {
    if (!match) return children;
    const { value, indices } = match;
    const { nodes: result } = indices.reduce<{ cursor: number; nodes: ReactNode[] }>(
      ({ cursor, nodes }, [start, end], index, { length }) => {
        nodes.push(<Text>{value.slice(cursor, start)}</Text>);
        nodes.push(<Mark>{value.slice(start, end + 1)}</Mark>);
        if (index === length - 1) {
          nodes.push(<Text>{value.slice(end + 1)}</Text>);
        }
        return { cursor: end + 1, nodes };
      },
      { cursor: 0, nodes: [] }
    );
    return <Text>{result}</Text>;
  }
);

const Title = styled.Text(({ theme }) => ({
  // display: 'grid',
  justifyContent: 'flex-start',
  // gridAutoColumns: 'auto',
  // gridAutoFlow: 'column',
  color: theme.textMutedColor,

  // '& > span': {
  //   display: 'block',
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  // },
}));

const Path = styled.View(({ theme }) => ({
  // display: 'grid',
  justifyContent: 'flex-start',
  // gridAutoColumns: 'auto',
  // gridAutoFlow: 'column',
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s1 - 1,

  // '& > span': {
  //   display: 'block',
  //   whiteSpace: 'nowrap',
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  // },

  // '& > span + span': {
  //   '&:before': {
  //     content: "' / '",
  //   },
  // },
}));

const Result: FC<
  SearchResult & {
    icon: string;
    isHighlighted: boolean;
    onPress: PressableProps['onPress'];
  }
> = React.memo(function Result({ item, matches, icon: _icon, onPress, ...props }) {
  const press: PressableProps['onPress'] = useCallback(
    (event) => {
      event.preventDefault();
      onPress?.(event);
    },
    [onPress]
  );

  // const api = useStorybookApi();
  // useEffect(() => {
  //   if (api && props.isHighlighted && item.type === 'component') {
  //     // api.emit(PRELOAD_ENTRIES, { ids: [item.children[0]] }, { options: { target: item.refId } });
  //   }
  // }, [props.isHighlighted, item]);

  const nameMatch = matches.find((match: FuseResultMatch) => match.key === 'name');
  const pathMatches = matches.filter((match: FuseResultMatch) => match.key === 'path');

  const [i] = item.status ? statusMapping[item.status] : [];

  return (
    <ResultRow {...props} onPress={press}>
      <IconWrapper>
        {item.type === 'component' && <ComponentIcon width="14" height="14" />}
        {item.type === 'story' && <StoryIcon width="14" height="14" />}
      </IconWrapper>
      <ResultRowContent testID="search-result-item--label">
        <Title>
          <Highlight match={nameMatch}>{item.name}</Highlight>
        </Title>
        <Path>
          {item.path.map((group, index) => (
            <View key={index}>
              <Text>
                <Highlight
                  match={pathMatches.find((match: FuseResultMatch) => match.refIndex === index)}
                >
                  {group}
                </Highlight>
              </Text>
            </View>
          ))}
        </Path>
      </ResultRowContent>
      {item.status ? i : null}
    </ResultRow>
  );
});

export const SearchResults: FC<{
  query: string;
  results: any[];
  closeMenu: (cb?: () => void) => void;
  // getMenuProps: any;
  // getItemProps: any;
  highlightedIndex: number | null;
  isLoading?: boolean;
  enableShortcuts?: boolean;
  clearLastViewed?: () => void;
}> = React.memo(function SearchResults({
  query,
  results,
  closeMenu,
  // getMenuProps,
  // getItemProps,
  highlightedIndex,
  // isLoading = false,
  // enableShortcuts = true,
  clearLastViewed,
}) {
  // const api = useStorybookApi();

  const handleClearLastViewed = () => {
    clearLastViewed();
    closeMenu();
  };

  return (
    <ResultsList /* {...getMenuProps()} */>
      {results.length > 0 && !query && (
        <RecentlyOpenedTitle /* className="search-result-recentlyOpened" */>
          Recently opened
          <IconButton
            // className="search-result-recentlyOpened-clear"
            onPress={handleClearLastViewed}
          >
            {/* <TrashIcon /> */}
          </IconButton>
        </RecentlyOpenedTitle>
      )}
      {results.length === 0 && query && (
        <View>
          <NoResults>
            <Text style={{ marginBottom: 8 }}>No components found</Text>
            {/* <br /> */}
            <Text>Find components by name or path.</Text>
          </NoResults>
        </View>
      )}
      {results.map((result, index) => {
        if (isExpandType(result)) {
          return (
            <MoreWrapper key="search-result-expand">
              <Button
                {...result}
                // {...getItemProps({ key: index, index, item: result })}
                size="small"
                text={`Show ${result.moreCount} more results`}
              />
            </MoreWrapper>
          );
        }

        const { item } = result;
        // const key = `${item.refId}::${item.id}`;
        return (
          <Result
            key={item.id}
            {...result}
            onPress={() => {
              console.log('pressed');
            }}
            // {...getItemProps({ key, index, item: result })}
            isHighlighted={highlightedIndex === index}
            // data-id={result.item.id}
            // data-refid={result.item.refId}
            className="search-result-item"
          />
        );
      })}
    </ResultsList>
  );
});
