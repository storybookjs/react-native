import { Addon, StoryFn, StoryContext, Parameters } from '@storybook/addons';
import StoryStore from './story_store';

export interface ErrorLike {
  message: string;
  stack: string;
}

export interface StoreItem extends StoryContext {
  getDecorated: () => StoryFn;
  getOriginal: () => StoryFn;
  story: string;
  storyFn: StoryFn;
}

export interface StoreData {
  [key: string]: StoreItem;
}

export interface ClientApiParams {
  storyStore: StoryStore;
  decorateStory: (storyFn: any, decorators: any) => any;
}

export interface StoryApi {
  addDecorator: (decorator: any) => StoryApi;
  addParameters: (parameters: any) => StoryApi;
  add: (storyName: string, getStory: StoryFn, parameters?: Parameters) => StoryApi;
  kind: string;
  [key: string]: any;
}
export type DecoratorFunction = (fn: StoryFn, c: StoryContext) => ReturnType<StoryFn>;

export interface LegacyItem {
  fileName: string;
  index: number;
  kind: string;
  stories: { [key: string]: any };
  revision?: number;
  selection?: { storyId: string };
}

export interface AddStoryArgs {
  id: string;
  kind: string;
  name: string;
  storyFn: StoryFn;
  parameters: Parameters;
}

export interface LegacyData {
  [K: string]: LegacyItem;
}

export interface ClientApiAddon extends Addon {
  apply: (a: StoryApi, b: any[]) => any;
}
export interface ClientApiAddons {
  [key: string]: ClientApiAddon;
}
