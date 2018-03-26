export interface NgModuleMetadata {
  declarations?: Array<any>;
  entryComponents?: Array<any>;
  imports?: Array<any>;
  schemas?: Array<any>;
  providers?: Array<any>;
}

export interface ICollection {
  [p: string]: any;
}

export interface NgStory {
  component?: any;
  props: ICollection;
  propsMeta?: ICollection;
  moduleMetadata?: NgModuleMetadata;
  template?: string;
  styles?: string[];
}

export interface NgError {
  message: string;
  stack: string;
}

export type NgProvidedData = NgStory | NgError;

export type IGetStory = () => NgStory;

export type IRenderStoryFn = (story: IGetStory, reRender?: boolean) => void;
export type IRenderErrorFn = (error: Error) => void;
