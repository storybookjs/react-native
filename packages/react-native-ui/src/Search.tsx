import { BottomSheetTextInput, useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { styled } from '@storybook/react-native-theming';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';
import React, { useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { CloseIcon } from './icon/CloseIcon';
import { SearchIcon } from './icon/SearchIcon';
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

// Microfuzz highlight types
type HighlightRange = [number, number];
type HighlightRanges = HighlightRange[];

const DEFAULT_MAX_SEARCH_RESULTS = 50;

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
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

const BottomSheetInput = styled(BottomSheetTextInput)(({ theme }) => ({
  height: 32,
  paddingLeft: 28,
  paddingRight: 28,
  paddingTop: Platform.OS === 'android' ? 0 : undefined,
  paddingBottom: Platform.OS === 'android' ? 0 : undefined,
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  backgroundColor: 'transparent',
  borderRadius: 4,
  fontSize: theme.typography.size.s1 + 1,
  color: theme.color.defaultText,
  width: '100%',
}));

const Input = styled(TextInput)(({ theme }) => ({
  height: 32,
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

export const Search = React.memo<{
  children: SearchChildrenFn;
  dataset: CombinedDataset;
  setSelection: (selection: Selection) => void;
  getLastViewed: () => Selection[];
  initialQuery?: string;
}>(function Search({ children, dataset, setSelection, getLastViewed, initialQuery = '' }) {
  const context = useBottomSheetInternal(true);
  const isBottomSheet = context !== null;

  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [allComponents, showAllComponents] = useState(false);
  const { scrollToSelectedNode } = useSelectedNode();

  const selectStory = useCallback(
    (id: string, refId: string) => {
      setSelection({ storyId: id, refId });

      inputRef.current?.blur();

      setIsOpen(false);

      showAllComponents(false);

      scrollToSelectedNode();
    },
    [scrollToSelectedNode, setSelection]
  );

  const getItemProps: GetSearchItemProps = useCallback(
    ({ item: result }) => {
      return {
        icon: result?.item?.type === 'component' ? 'component' : 'story',
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
        item: result.item,
        matches: result.matches,
        isHighlighted: false,
      };
    },
    [selectStory]
  );

  // Defer dataset updates to prevent blocking during data changes
  const deferredDataset = useDeferredValue(dataset);

  // Build the search list - memoized
  const searchList = useMemo(() => {
    return deferredDataset.entries.reduce<SearchItem[]>((acc, [refId, { index }]) => {
      if (index) {
        acc.push(
          ...Object.values(index).map((item) => {
            return searchItem(item, deferredDataset.hash[refId]);
          })
        );
      }
      return acc;
    }, []);
  }, [deferredDataset]);

  // Defer query input to prevent blocking typing
  const deferredQuery = useDeferredValue(inputValue);
  const queryText = useMemo(() => (deferredQuery ? deferredQuery.trim() : ''), [deferredQuery]);

  // getText function for microfuzz - memoized for performance
  // Returns [name, path] - matches[0] will be name highlights, matches[1] will be path highlights
  const getText = useCallback((item: SearchItem) => [item.name, item.path?.join(' ') ?? ''], []);

  // Map microfuzz result to our SearchResult type (native format)
  const mapResultItem = useCallback(
    ({
      item,
      score,
      matches,
    }: {
      item: SearchItem;
      score: number | null;
      matches: HighlightRanges[];
    }): SearchResult => ({
      item,
      score,
      matches: matches ?? [],
    }),
    []
  );

  // Use microfuzz's React hook with built-in memoization
  const fuzzyResults = useFuzzySearchList({
    list: searchList,
    queryText,
    getText,
    mapResultItem,
  });

  // Process results: filter, deduplicate, and limit
  const results = useMemo(() => {
    if (!queryText) return [];

    const maxResults = allComponents ? 1000 : DEFAULT_MAX_SEARCH_RESULTS;
    const processedResults = [];
    const resultIds = new Set<string>();

    let totalDistinctCount = 0;

    for (const result of fuzzyResults) {
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
      if (processedResults.length < maxResults) {
        processedResults.push(result);
      }

      // Early exit when showing all components and we have enough
      if (allComponents && processedResults.length >= maxResults) {
        break;
      }
    }

    // Add "show all" option if there are more results than displayed
    if (!allComponents && totalDistinctCount > DEFAULT_MAX_SEARCH_RESULTS) {
      processedResults.push({
        showAll: () => showAllComponents(true),
        totalCount: totalDistinctCount,
        moreCount: totalDistinctCount - DEFAULT_MAX_SEARCH_RESULTS,
      });
    }

    return processedResults;
  }, [queryText, fuzzyResults, allComponents]);

  return (
    <View style={{ flex: 1 }}>
      <SearchField>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>

        {isBottomSheet ? (
          <BottomSheetInput
            ref={inputRef as any} // TODO find solution for this
            onChangeText={setInputValue}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          />
        ) : (
          <Input ref={inputRef} onChangeText={setInputValue} onFocus={() => setIsOpen(true)} />
        )}

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

      {children({
        query: queryText,
        results,
        isBrowsing: !isOpen || !inputValue.length,
        closeMenu: () => {},
        getItemProps,
        highlightedIndex: null,
      })}
    </View>
  );
});
