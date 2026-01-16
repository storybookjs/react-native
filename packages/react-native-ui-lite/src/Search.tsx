import { styled } from '@storybook/react-native-theming';
import type { IFuseOptions } from 'fuse.js';
import Fuse from 'fuse.js';
import React, { useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { Platform, TextInput, View, ViewStyle } from 'react-native';
import { useSelectedNode } from './SelectedNodeProvider';
import {
  type CombinedDataset,
  type GetSearchItemProps,
  isExpandType,
  type SearchChildrenFn,
  type SearchItem,
  type SearchResult,
  type Selection,
  searchItem,
} from '@storybook/react-native-ui-common';
import { CloseIcon, SearchIcon } from './icon/iconDataUris';

const DEFAULT_MAX_SEARCH_RESULTS = 50;

const options = {
  shouldSort: true,
  tokenize: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'path', weight: 0.3 },
  ],
} as IFuseOptions<SearchItem>;

const SearchIconWrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 8,
  zIndex: 1,
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
});

const SearchField = styled.View({
  flexShrink: 0,
});

const inputPlatformSpecificStyles = Platform.select({
  macos: {
    paddingVertical: 6,
  },
  android: {
    minHeight: 32,
  },
  default: {
    minHeight: 32,
    height: 32,
  },
});

const Input = styled(TextInput)(({ theme }) => ({
  ...inputPlatformSpecificStyles,
  paddingLeft: 28,
  paddingRight: 28,
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  backgroundColor: 'transparent',
  borderRadius: 6,
  fontSize: theme.typography.size.s1 + 1,
  color: theme.color.defaultText,
  width: '100%',
}));

const ClearIcon = styled.TouchableOpacity(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 8,
  zIndex: 1,
  color: theme.textMutedColor,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

const flexStyle: ViewStyle = { flex: 1 };
const searchFieldWrapperStyle: ViewStyle = { paddingHorizontal: 10, marginBottom: 4 };

export const Search = React.memo<{
  children: SearchChildrenFn;
  dataset: CombinedDataset;
  setSelection: (selection: Selection) => void;
  getLastViewed: () => Selection[];
  initialQuery?: string;
}>(function Search({ children, dataset, setSelection, getLastViewed, initialQuery = '' }) {
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [allComponents, showAllComponents] = useState(false);

  const { scrollCallback } = useSelectedNode();

  const selectStory = useCallback(
    (id: string, refId: string) => {
      setSelection({ storyId: id, refId });

      inputRef.current?.blur();

      setIsOpen(false);

      showAllComponents(false);

      scrollCallback({ id, animated: false });
    },
    [scrollCallback, setSelection]
  );

  const getItemProps: GetSearchItemProps = useCallback(
    ({ item: result }) => {
      return {
        icon: result?.item?.type === 'component' ? 'component' : 'story',
        result,
        onPress: () => {
          if (result?.item?.type === 'story') {
            selectStory(result.item.id, result.item.refId);
          } else if (result?.item?.type === 'component') {
            selectStory(result.item.children[0], result.item.refId);
          } else if (isExpandType(result) && result.showAll) {
            result.showAll();
          }
        },
        score: result.score,
        refIndex: result.refIndex,
        item: result.item,
        matches: result.matches,
        isHighlighted: false,
      };
    },
    [selectStory]
  );

  // Defer dataset updates to prevent blocking during data changes
  const deferredDataset = useDeferredValue(dataset);

  // Memoize the Fuse instance - only recreate when dataset changes
  const fuse = useMemo(() => {
    const list = deferredDataset.entries.reduce<SearchItem[]>((acc, [refId, { index }]) => {
      if (index) {
        acc.push(
          ...Object.values(index).map((item) => {
            return searchItem(item, deferredDataset.hash[refId]);
          })
        );
      }
      return acc;
    }, []);
    return new Fuse(list, options);
  }, [deferredDataset]);

  const getResults = useCallback(
    (input: string) => {
      if (!input) return [];

      const maxResults = allComponents ? 1000 : DEFAULT_MAX_SEARCH_RESULTS;
      const results = [];
      const resultIds = new Set<string>();
      const searchResults = fuse.search(input) as SearchResult[];

      let totalDistinctCount = 0;

      for (const result of searchResults) {
        const { item } = result;

        // Skip invalid types or duplicates
        if (
          !(item.type === 'component' || item.type === 'docs' || item.type === 'story') ||
          resultIds.has(item.parent)
        ) {
          continue;
        }

        resultIds.add(item.id);
        totalDistinctCount++;

        // Only add to results if we haven't reached the limit
        if (results.length < maxResults) {
          results.push(result);
        }

        // Early exit when showing all components and we have enough
        if (allComponents && results.length >= maxResults) {
          break;
        }
      }

      // Add "show all" option if there are more results than displayed
      if (!allComponents && totalDistinctCount > DEFAULT_MAX_SEARCH_RESULTS) {
        results.push({
          showAll: () => showAllComponents(true),
          totalCount: totalDistinctCount,
          moreCount: totalDistinctCount - DEFAULT_MAX_SEARCH_RESULTS,
        });
      }

      return results;
    },
    [allComponents, fuse]
  );

  // Defer query input to prevent blocking typing
  const deferredQuery = useDeferredValue(inputValue);

  // Memoize results calculation
  const input = useMemo(() => (deferredQuery ? deferredQuery.trim() : ''), [deferredQuery]);
  const results = useMemo(() => {
    return input ? getResults(input) : [];
  }, [input, getResults]);

  return (
    <View style={flexStyle}>
      <View style={searchFieldWrapperStyle}>
        <SearchField>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>

          <Input
            ref={inputRef}
            onChangeText={setInputValue}
            onFocus={() => setIsOpen(true)}
            returnKeyType="search"
          />

          {isOpen && (
            <ClearIcon
              onPress={() => {
                setInputValue('');
                inputRef.current.clear();
              }}
            >
              <CloseIcon />
            </ClearIcon>
          )}
        </SearchField>
      </View>

      <View style={flexStyle}>
        {children({
          query: input,
          results,
          isBrowsing: !isOpen || !inputValue.length,
          closeMenu: () => {},
          getItemProps,
          highlightedIndex: null,
        })}
      </View>
    </View>
  );
});
