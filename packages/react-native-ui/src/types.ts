import type { StoriesHash, State } from '@storybook/manager-api';
// import type { ControllerStateAndHelpers } from 'downshift';
import type { API_StatusState, API_StatusValue } from '@storybook/types';
import * as Fuse from 'fuse.js';

export type Refs = State['refs'];
export type RefType = Refs[keyof Refs] & { status?: API_StatusState };
export type Item = StoriesHash[keyof StoriesHash];
export type Dataset = Record<string, Item>;

export interface CombinedDataset {
  hash: Refs;
  entries: [string, RefType][];
}

export interface ItemRef {
  itemId: string;
  refId: string;
}
export interface StoryRef {
  storyId: string;
  refId: string;
}

export type Highlight = ItemRef | null;
export type Selection = StoryRef | null;

// export interface Match {
//   value: string;
//   indices: [number, number][];
//   key: 'name' | 'path';
//   arrayIndex: number;
// }

export function isExpandType(x: any): x is ExpandType {
  return !!(x && x.showAll);
}
// export function isSearchResult(x: any): x is SearchResult {
//   return !!(x && x.item);
// }
export interface ExpandType {
  showAll: () => void;
  totalCount: number;
  moreCount: number;
}

export type SearchItem = Item & { refId: string; path: string[]; status?: API_StatusValue };

export type SearchResult = Fuse.FuseResult<SearchItem>;

// export type DownshiftItem = SearchResult | ExpandType;

export type SearchChildrenFn = (args: {
  query: string;
  results: any; // TODO fix this type
  isBrowsing: boolean;
  closeMenu: (cb?: () => void) => void;
  // getMenuProps: ControllerStateAndHelpers<DownshiftItem>['getMenuProps'];
  // getItemProps: ControllerStateAndHelpers<DownshiftItem>['getItemProps'];
  highlightedIndex: number | null;
}) => React.ReactNode;
