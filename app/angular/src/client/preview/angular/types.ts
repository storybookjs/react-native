export interface NgModuleMetadata {
    declarations: Array<any>,
    imports: Array<any>,
    schemas: Array<any>,
    providers: Array<any>,
}
  
export interface NgStory {
    component: any,
    props: object,
    propsMeta: object,
    moduleMetadata?: NgModuleMetadata
}

export interface NgError {
    message: string,
    stack: string
}

export type NgProvidedData = NgStory | NgError;