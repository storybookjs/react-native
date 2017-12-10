export interface IStorybookStory {
    name: string,
    render: () => any
}

export interface IStoribookSection {
    kind: string,
    stories: IStorybookStory[]
}

export type IGetStory = () => {
    props?: {[p: string]: any};
    component: any
};

export interface IApi {
    kind: string;
    addDecorator: (decorator: any) => IApi;
    add: (storyName: string, getStory: IGetStory ) => IApi;
}

declare module '@storybook/angular' {
    export function storiesOf(kind: string, module: NodeModule): IApi;
    export function setAddon(addon: any): void;
    export function addDecorator(decorator: any): IApi;
    export function configure(loaders: () => NodeRequire, module: NodeModule): void;
    export function getStorybook(): IStoribookSection[];
}
