import type { Args, StoryContext } from 'storybook/internal/csf';
import type { ReactRenderer } from '@storybook/react';
import { Theme } from '@storybook/react-native-theming';
import { Storage } from './StorageProvider';
import { ReactElement, ReactNode } from 'react';
import { PressableProps } from 'react-native';
import type { State, StoriesHash } from 'storybook/manager-api';
import type {
  API_IndexHash,
  StatusesByStoryIdAndTypeId,
  StatusValue,
} from 'storybook/internal/types';

// Microfuzz highlight range: [startIndex, endIndex] (inclusive)
export type HighlightRange = [number, number];
// Array of highlight ranges per getText field
export type HighlightRanges = HighlightRange[];

export type Refs = State['refs'];
export type RefType = Refs[keyof Refs] & { allStatuses?: StatusesByStoryIdAndTypeId };
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
  status?: StatusValue;
  showAll?: () => void;
};

// Native microfuzz result format
export interface SearchResult {
  item: SearchItem;
  score: number | null;
  // matches[0] = name highlights, matches[1] = path highlights
  matches: HighlightRanges[];
}

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
  results: SearchResult[];
  isBrowsing: boolean;
  closeMenu: (cb?: () => void) => void;
  getItemProps: GetSearchItemProps;
  highlightedIndex: number | null;
}) => ReactNode;

export type SBUI = (props: {
  story?: StoryContext<ReactRenderer, Args>;
  storyHash: API_IndexHash;
  setStory: (storyId: string) => void;
  storage: Storage;
  theme: Theme;
  children: ReactElement;
}) => ReactElement;
