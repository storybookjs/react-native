import React, { useMemo } from 'react';
import { styled } from '@storybook/react-native-theming';
import type { State } from 'storybook/manager-api';
import type { API_LoadedRefData } from 'storybook/internal/types';
import { Explorer } from './Explorer';
import { Search } from './Search';
import { SearchResults } from './SearchResults';
import type { CombinedDataset, Selection } from '@storybook/react-native-ui-common';
import { useLastViewed } from '@storybook/react-native-ui-common';
import { DEFAULT_REF_ID } from './constants';
import { View } from 'react-native';

const Container = styled.View(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.background.content,
}));

const Top = styled.View({
  paddingLeft: 4,
  paddingRight: 4,
  paddingTop: 16,
  flex: 1,
  flexDirection: 'row',
});

const Swap = React.memo(function Swap({
  children,
  condition,
}: {
  children: React.ReactNode;
  condition: boolean;
}) {
  const [a, b] = React.Children.toArray(children);
  return (
    <>
      <View style={{ display: condition ? 'flex' : 'none' }}>{a}</View>
      <View style={{ display: condition ? 'none' : 'flex' }}>{b}</View>
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
    <Container style={{ paddingHorizontal: 10 }}>
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
