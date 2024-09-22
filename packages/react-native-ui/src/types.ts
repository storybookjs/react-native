import type { StoriesHash, State } from '@storybook/core/manager-api';
import type { API_StatusState, API_StatusValue } from '@storybook/core/types';
import * as Fuse from 'fuse.js';
import { PressableProps } from 'react-native';

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

export function isExpandType(x: any): x is ExpandType {
  return !!(x && x.showAll);
}

export interface ExpandType {
  showAll: () => void;
  totalCount: number;
  moreCount: number;
}

export type SearchItem = Item & {
  refId: string;
  path: string[];
  status?: API_StatusValue;
  showAll?: () => void;
};

export type SearchResult = Fuse.FuseResult<SearchItem>;

export type SearchResultProps = SearchResult & {
  icon: string;
  isHighlighted: boolean;
  onPress: PressableProps['onPress'];
};

export type GetSearchItemProps = (args: {
  item: SearchResult;
  index: number;
  key: string;
}) => SearchResultProps;

export type SearchChildrenFn = (args: {
  query: string;
  results: SearchResult[]; // TODO fix this type
  isBrowsing: boolean;
  closeMenu: (cb?: () => void) => void;
  getItemProps: GetSearchItemProps;
  highlightedIndex: number | null;
}) => React.ReactNode;
