import { useStorybookApi /* shortcutToHumanString */ } from '@storybook/manager-api';
import { styled } from '@storybook/react-native-theming';
// import type { DownshiftState, StateChangeOptions } from 'downshift';
// import Downshift from 'downshift';
import type { IFuseOptions } from 'fuse.js';
import Fuse from 'fuse.js';
// import { global } from '@storybook/global';
import React, { useRef, useState, useCallback } from 'react';
// import { CloseIcon, SearchIcon } from '@storybook/icons';
// import { DEFAULT_REF_ID } from './constants';
import {
  type CombinedDataset,
  type SearchItem,
  type SearchResult,
  // DownshiftItem,
  type SearchChildrenFn,
  type Selection,
  type GetSearchItemProps,
  isExpandType,
} from './types';
// import { isSearchResult, isExpandType } from './types';

import { /* scrollIntoView */ searchItem } from './util/tree';
import { getGroupStatus, getHighestStatus } from './util/status';
// import { useLayout } from './LayoutProvider';
import { SearchIcon } from './icon/SearchIcon';
import { CloseIcon } from './icon/CloseIcon';
import { TextInput, View } from 'react-native';
import { DEFAULT_REF_ID } from './constants';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

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

const SearchIconWrapper = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 8,
  zIndex: 1,
  pointerEvents: 'none',
  color: theme.textMutedColor,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
}));

const SearchField = styled.View({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  // marginBottom: 16,
});

const Input = styled(BottomSheetTextInput)(({ theme }) => ({
  // appearance: 'none',
  height: 32,
  paddingLeft: 28,
  paddingRight: 28,
  borderWidth: 1,
  borderColor: theme.appBorderColor,
  backgroundColor: 'transparent',
  borderRadius: 4,
  fontSize: theme.typography.size.s1 + 1,
  // transition: 'all 150ms',
  color: theme.color.defaultText,
  width: '100%',

  // '&:focus, &:active': {
  //   outline: 0,
  //   borderColor: theme.color.secondary,
  //   background: theme.background.app,
  // },
  // '&::placeholder': {
  //   color: theme.textMutedColor,
  //   opacity: 1,
  // },
  // '&:valid ~ code, &:focus ~ code': {
  //   display: 'none',
  // },
  // '&:invalid ~ svg': {
  //   display: 'none',
  // },
  // '&:valid ~ svg': {
  //   display: 'block',
  // },
  // '&::-ms-clear': {
  //   display: 'none',
  // },
  // '&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration':
  //   {
  //     display: 'none',
  //   },
}));

// const FocusKey = styled.Text(({ theme }) => ({
//   position: 'absolute',
//   top: 8,
//   right: 9,
//   height: 16,
//   zIndex: 1,
//   lineHeight: 16,
//   textAlign: 'center',
//   fontSize: 11,
//   color: theme.base === 'light' ? theme.color.dark : theme.textMutedColor,
//   userSelect: 'none',
//   pointerEvents: 'none',
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   gap: 4,
// }));

// const FocusKeyCmd = styled.Text({
//   fontSize: 14,
// });

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

// const FocusContainer = styled.View({});

export const Search = React.memo<{
  children: SearchChildrenFn;
  dataset: CombinedDataset;
  // enableShortcuts?: boolean;
  setSelection: (selection: Selection) => void;
  getLastViewed: () => Selection[];
  initialQuery?: string;
}>(function Search({
  children,
  dataset,
  setSelection,
  // enableShortcuts = true,
  getLastViewed,
  initialQuery = '',
}) {
  const api = useStorybookApi();
  // const inputRef = useRef<HTMLInputElement>(null);
  // const [inputPlaceholder, setPlaceholder] = useState('Find components');
  // const isFocused = useRef(false);
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [allComponents, showAllComponents] = useState(false);
  // const searchShortcut = api ? shortcutToHumanString(api.getShortcutKeys().search) : '/';

  const selectStory = useCallback(
    (id: string, refId: string) => {
      if (api) {
        api.selectStory(id, undefined, { ref: refId !== DEFAULT_REF_ID && refId });
      }
      setSelection({ storyId: id, refId });
      inputRef.current?.blur();
      // inputRef.current?.clear();
      // setInputValue('');

      showAllComponents(false);
    },
    [api, setSelection]
  );

  const getItemProps: GetSearchItemProps = useCallback(
    ({ item: result }) => {
      return {
        icon: result?.item?.type === 'component' ? 'component' : 'story',
        // isHighlighted:
        result,
        onPress: () => {
          if (result?.item?.type === 'story') {
            selectStory(result.item.id, result.item.refId);
          } else if (result?.item?.type === 'component') {
            selectStory(result.item.children[0], result.item.refId);
          } else if (isExpandType(result) && result.showAll) {
            result.showAll();
          }

          // selectStory(result.item.id, result.item.refId);
        },
        score: result.score,
        refIndex: result.refIndex,
        item: result.item,
        matches: result.matches,
        isHighlighted: false,
        // isHighlighted: searchItem.
        // isHighlighted: searchItem.item.
      };
    },
    [selectStory]
  );

  const makeFuse = useCallback(() => {
    const list = dataset.entries.reduce<SearchItem[]>((acc, [refId, { index, status }]) => {
      const groupStatus = getGroupStatus(index || {}, status);

      if (index) {
        acc.push(
          ...Object.values(index).map((item) => {
            const statusValue =
              status && status[item.id]
                ? getHighestStatus(Object.values(status[item.id] || {}).map((s) => s.status))
                : null;
            return {
              ...searchItem(item, dataset.hash[refId]),
              status: statusValue || groupStatus[item.id] || null,
            };
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

  // const { isMobile } = useLayout();

  const input = inputValue ? inputValue.trim() : '';
  const results = input ? getResults(input) : [];

  return (
    <View style={{ flex: 1 }}>
      <SearchField
      // {...getRootProps({ refKey: '' }, { suppressRefError: true })}
      // className="search-field"
      >
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>

        <Input
          ref={inputRef as any} // TODO find solution for this
          onChangeText={setInputValue}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
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

      {children({
        query: input,
        results,
        isBrowsing: !isOpen || !inputValue.length,
        closeMenu: () => {},
        // getMenuProps,
        getItemProps,
        highlightedIndex: null,
      })}
    </View>
  );
});
