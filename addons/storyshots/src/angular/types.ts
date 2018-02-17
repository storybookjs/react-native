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
}
