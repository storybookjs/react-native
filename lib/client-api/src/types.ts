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
  decorateStory?: (storyFn: any, decorators: any) => any;
}

export type ClientApiReturnFn<TApi> = (...args: any[]) => StoryApi<TApi>;

export interface StoryApi<TApi> {
  kind: string;
  add: (storyName: string, storyFn: StoryFn, parameters: Parameters) => StoryApi<TApi>;
  addDecorator: (decorator: DecoratorFunction) => StoryApi<TApi>;
  addParameters: (parameters: Parameters) => StoryApi<TApi>;
  [k: string]: string | ClientApiReturnFn<TApi>;
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

export interface ClientApiAddon<TApi = unknown> extends Addon {
  apply: (a: StoryApi<TApi>, b: any[]) => any;
}
export interface ClientApiAddons<TApi> {
  [key: string]: ClientApiAddon<TApi>;
}
