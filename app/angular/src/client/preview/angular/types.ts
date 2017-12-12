export type NgModuleMetadata = {
    declarations: Array<any>,
    imports: Array<any>,
    schemas: Array<any>,
    providers: Array<any>
}
  
export type NgStory = {
    component: any;
    props: object;
    propsMeta: object;
    moduleMetadata: NgModuleMetadata
} 

export type Data = {
    component: any;
    props: ErrorProps | object;
    propsMeta: object;
}

type ErrorProps = {
    message: string
    stack: string
}