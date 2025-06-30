import type { Args, StoryContext } from 'storybook/internal/csf';
import type { ReactRenderer } from '@storybook/react';
import { Theme } from '@storybook/react-native-theming';
import { Storage } from './StorageProvider';
import * as Fuse from 'fuse.js';
import { ReactElement, ReactNode } from 'react';
import { PressableProps } from 'react-native';
import type { State, StoriesHash } from 'storybook/internal/manager-api';
import type {
  API_IndexHash,
  StatusesByStoryIdAndTypeId,
  StatusValue,
} from 'storybook/internal/types';

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
}) => ReactNode;

export type SBUI = (props: {
  story?: StoryContext<ReactRenderer, Args>;
  storyHash: API_IndexHash;
  setStory: (storyId: string) => void;
  storage: Storage;
  theme: Theme;
  children: ReactElement;
}) => ReactElement;
