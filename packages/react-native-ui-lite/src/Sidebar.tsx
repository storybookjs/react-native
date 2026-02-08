import { styled } from '@storybook/react-native-theming';
import type { CombinedDataset, Selection } from '@storybook/react-native-ui-common';
import { useLastViewed } from '@storybook/react-native-ui-common';
import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import type { State } from 'storybook/manager-api';
import type { API_LoadedRefData } from 'storybook/internal/types';
import { DEFAULT_REF_ID } from './constants';
import { Explorer } from './Explorer';
import { Search } from './Search';
import { SearchResults } from './SearchResults';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'column',
  backgroundColor: theme.background.content,
}));

const Top = styled.View({
  paddingTop: 8,
  flex: 1,
});

const flexStyle: ViewStyle = { flex: 1 };

// legend list print a warning if the items height is 0
const noneStyle: ViewStyle = {
  // display: 'none',
  height: 1,
  width: 0,
  opacity: 0,
};

const Swap = React.memo(function Swap({
  children,
  condition,
}: {
  children: React.ReactNode;
  condition: boolean;
}) {
  const [a, b] = React.Children.toArray(children);

  const aStyle = useMemo(() => (condition ? flexStyle : noneStyle), [condition]);
  const bStyle = useMemo(() => (condition ? noneStyle : flexStyle), [condition]);
  // // NOTE: its important not to completely hide items so that we don't lose the state of our list items
  return (
    <>
      <View
        style={aStyle}
        accessibilityElementsHidden={!condition}
        importantForAccessibility={condition ? 'auto' : 'no-hide-descendants'}
      >
        {a}
      </View>
      <View
        style={bStyle}
        accessibilityElementsHidden={condition}
        importantForAccessibility={condition ? 'no-hide-descendants' : 'auto'}
      >
        {b}
      </View>
    </>
  );
});

export const useCombination = (
  index: SidebarProps['index'],
  indexError: SidebarProps['indexError'],
  previewInitialized: SidebarProps['previewInitialized'],
  status: SidebarProps['status'],
  refs: SidebarProps['refs']
): CombinedDataset => {
  const hash = useMemo(
    () => ({
      [DEFAULT_REF_ID]: {
        index,
        indexError,
        previewInitialized,
        status,
        title: null,
        id: DEFAULT_REF_ID,
        url: 'iframe.html',
      },
      ...refs,
    }),
    [refs, index, indexError, previewInitialized, status]
  );
  return useMemo(() => ({ hash, entries: Object.entries(hash) }), [hash]);
};

export interface SidebarProps extends API_LoadedRefData {
  refs: State['refs'];
  status: State['status'];
  storyId?: string;
  refId?: string;
  menuHighlighted?: boolean;
  setSelection: (selection: Selection) => void;
}

export const Sidebar = React.memo(function Sidebar({
  storyId = null,
  refId = DEFAULT_REF_ID,
  index,
  indexError,
  status,
  previewInitialized,
  refs = {},
  setSelection,
}: SidebarProps) {
  const selected: Selection = useMemo(() => storyId && { storyId, refId }, [storyId, refId]);
  const dataset = useCombination(index, indexError, previewInitialized, status, refs);
  const lastViewedProps = useLastViewed(selected);

  return (
    <Container>
      <Top>
        {/* <Heading
            className="sidebar-header"
            menuHighlighted={menuHighlighted}
            menu={menu}
            extra={extra}
            skipLinkHref="#storybook-preview-wrapper"
            isLoading={isLoading}
            onMenuClick={onMenuClick}
          /> */}
        <Search dataset={dataset} setSelection={setSelection} {...lastViewedProps}>
          {({ query, results, isBrowsing, closeMenu, getItemProps, highlightedIndex }) => (
            <Swap condition={isBrowsing}>
              <Explorer
                dataset={dataset}
                selected={selected}
                isLoading={false}
                isBrowsing={isBrowsing} //todo check me
                setSelection={setSelection}
              />

              <SearchResults
                query={query}
                results={results}
                closeMenu={closeMenu}
                getItemProps={getItemProps}
                highlightedIndex={highlightedIndex}
                isLoading={false}
                clearLastViewed={lastViewedProps.clearLastViewed}
              />
            </Swap>
          )}
        </Search>
      </Top>
    </Container>
  );
});
