import { BottomSheetTextInput, useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { styled } from '@storybook/react-native-theming';
import type { IFuseOptions } from 'fuse.js';
import Fuse from 'fuse.js';
import React, { useCallback, useDeferredValue, useRef, useState } from 'react';
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
  // const { isMobile } = useLayout();
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

  const makeFuse = useCallback(() => {
    const list = dataset.entries.reduce<SearchItem[]>((acc, [refId, { index }]) => {
      if (index) {
        acc.push(
          ...Object.values(index).map((item) => {
            return searchItem(item, dataset.hash[refId]);
          })
        );
      }
      return acc;
    }, []);
    return new Fuse(list, options);
  }, [dataset]);

  const getResults = useCallback(
    (input: string) => {
      const fuse = makeFuse();
      if (!input) return [];

      let results = [];
      const resultIds: Set<string> = new Set();
      const distinctResults = (fuse.search(input) as SearchResult[]).filter(({ item }) => {
        if (
          !(item.type === 'component' || item.type === 'docs' || item.type === 'story') ||
          resultIds.has(item.parent)
        ) {
          return false;
        }
        resultIds.add(item.id);
        return true;
      });

      if (distinctResults.length) {
        results = distinctResults.slice(0, allComponents ? 1000 : DEFAULT_MAX_SEARCH_RESULTS);
        if (distinctResults.length > DEFAULT_MAX_SEARCH_RESULTS && !allComponents) {
          results.push({
            showAll: () => showAllComponents(true),
            totalCount: distinctResults.length,
            moreCount: distinctResults.length - DEFAULT_MAX_SEARCH_RESULTS,
          });
        }
      }

      const lastViewed = !input && getLastViewed();
      if (lastViewed && lastViewed.length) {
        results = lastViewed.reduce((acc, { storyId, refId }) => {
          const data = dataset.hash[refId];
          if (data && data.index && data.index[storyId]) {
            const story = data.index[storyId];
            const item = story.type === 'story' ? data.index[story.parent] : story;
            // prevent duplicates
            if (!acc.some((res) => res.item.refId === refId && res.item.id === item.id)) {
              acc.push({ item: searchItem(item, dataset.hash[refId]), matches: [], score: 0 });
            }
          }
          return acc;
        }, []);
      }

      return results;
    },
    [allComponents, dataset.hash, getLastViewed, makeFuse]
  );
  const deferredQuery = useDeferredValue(inputValue);
  const input = deferredQuery ? deferredQuery.trim() : '';
  const results = input ? getResults(input) : [];

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
        query: input,
        results,
        isBrowsing: !isOpen || !inputValue.length,
        closeMenu: () => {},
        getItemProps,
        highlightedIndex: null,
      })}
    </View>
  );
});
