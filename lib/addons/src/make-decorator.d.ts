export interface StoryContext {
    story: string;
    kind: string;
}
export interface WrapperSettings {
    options: object;
    parameters: any;
}
export declare type StoryGetter = (context: StoryContext) => any;
export declare type StoryWrapper = (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => any;
declare type MakeDecoratorResult = (...args: any) => any;
export declare const makeDecorator: MakeDecoratorResult;
export {};
