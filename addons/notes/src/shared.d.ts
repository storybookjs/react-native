export declare const ADDON_ID = "storybooks/notes";
export declare const PANEL_ID: string;
export declare const PARAM_KEY = "notes";
export interface API {
    on(event: string, callback: (...args: any) => any): void;
    off(event: string, callback: (...args: any) => any): void;
    emit(event: string, callback: (...args: any) => any): void;
    getParameters(id: string, scope?: string): undefined | Parameters;
}
interface TextParameter {
    text: string;
}
interface MarkdownParameter {
    markdown: string;
}
interface DisabledParameter {
    disable: boolean;
}
export declare type Parameters = string | TextParameter | MarkdownParameter | DisabledParameter;
export {};
