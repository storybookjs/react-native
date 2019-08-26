import { HooksContext } from './hooks';
import { Addon } from './index';

export enum types {
  TAB = 'tab',
  PANEL = 'panel',
  TOOL = 'tool',
  PREVIEW = 'preview',
  NOTES_ELEMENT = 'notes-element',
}

export type Types = types | string;

export function isSupportedType(type: Types): boolean {
  return !!Object.values(types).find(typeVal => typeVal === type);
}

export interface Parameters {
  fileName?: string;
  options?: OptionsParameter;
  [key: string]: any;
}

export interface StoryContext {
  id: string;
  name: string;
  kind: string;
  [key: string]: any;
  parameters: Parameters;
  hooks?: HooksContext;
}

export interface WrapperSettings {
  options: OptionsParameter;
  parameters: {
    [key: string]: any;
  };
}

export interface OptionsParameter extends Object {
  storySort?: any;
  hierarchyRootSeparator?: string;
  hierarchySeparator?: RegExp;
  theme?: {
    base: string;
    brandTitle?: string;
  };
  [key: string]: any;
}

export type StoryGetter = (context: StoryContext) => any;
export type StoryFn<ReturnType = unknown> = (p?: StoryContext) => ReturnType;

export type StoryWrapper = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperSettings
) => any;

export type MakeDecoratorResult = (...args: any) => any;

export interface AddStoryArgs<StoryFnReturnType = unknown> {
  id: string;
  kind: string;
  name: string;
  storyFn: StoryFn<StoryFnReturnType>;
  parameters: Parameters;
}

export interface ClientApiAddon<StoryFnReturnType = unknown> extends Addon {
  apply: (a: StoryApi<StoryFnReturnType>, b: any[]) => any;
}
export interface ClientApiAddons<StoryFnReturnType> {
  [key: string]: ClientApiAddon<StoryFnReturnType>;
}

export type ClientApiReturnFn<StoryFnReturnType> = (...args: any[]) => StoryApi<StoryFnReturnType>;

export interface StoryApi<StoryFnReturnType = unknown> {
  kind: string;
  add: (
    storyName: string,
    storyFn: StoryFn<StoryFnReturnType>,
    parameters?: Parameters
  ) => StoryApi<StoryFnReturnType>;
  addDecorator: (decorator: DecoratorFunction<StoryFnReturnType>) => StoryApi<StoryFnReturnType>;
  addParameters: (parameters: Parameters) => StoryApi<StoryFnReturnType>;
  [k: string]: string | ClientApiReturnFn<StoryFnReturnType>;
}

export type DecoratorFunction<StoryFnReturnType = unknown> = (
  fn: StoryFn<StoryFnReturnType>,
  c: StoryContext
) => ReturnType<StoryFn<StoryFnReturnType>>;

export interface ClientStoryApi<StoryFnReturnType = unknown> {
  storiesOf(kind: string, module: NodeModule): StoryApi<StoryFnReturnType>;
  addDecorator(decorator: DecoratorFunction<StoryFnReturnType>): StoryApi<StoryFnReturnType>;
  addParameters(parameter: Parameters): StoryApi<StoryFnReturnType>;
}

type LoadFn = () => any;
type RequireContext = any; // FIXME
export type Loadable = RequireContext | [RequireContext] | LoadFn;
