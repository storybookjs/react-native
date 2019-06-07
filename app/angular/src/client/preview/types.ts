export declare const moduleMetadata: (
  metadata: Partial<NgModuleMetadata>
) => (storyFn: () => any) => any;

export interface NgModuleMetadata {
  declarations?: any[];
  entryComponents?: any[];
  imports?: any[];
  schemas?: any[];
  providers?: any[];
}
export interface ICollection {
  [p: string]: any;
}

export interface IStorybookStory {
  name: string;
  render: () => any;
}

// @deprecated Use IStorybookSection instead
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStoribookSection extends IStorybookSection {}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface IStoryContext {
  kind: string;
  name: string;
  parameters: any;
}

export interface IStory {
  props?: ICollection;
  moduleMetadata?: Partial<NgModuleMetadata>;
  component?: any;
  template?: string;
}

export type IGetStory = (context: IStoryContext) => IStory;

export interface IApi {
  kind: string;
  addDecorator: (decorator: any) => IApi;
  addParameters: (parameters: any) => IApi;
  add: (storyName: string, getStory: IGetStory, parameters?: any) => IApi;
}
