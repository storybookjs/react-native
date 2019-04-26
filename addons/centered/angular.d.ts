export interface ICollection {
  [p: string]: any;
}

export interface NgModuleMetadata {
  declarations?: any[];
  entryComponents?: any[];
  imports?: any[];
  schemas?: any[];
  providers?: any[];
}

export interface IStory {
  props?: ICollection;
  moduleMetadata?: Partial<NgModuleMetadata>;
  component?: any;
  template?: string;
}
declare module '@storybook/addon-centered/angular' {
  export function centered(story: IStory): IStory;
}
