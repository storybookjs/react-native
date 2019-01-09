export declare enum types {
    TAB = "tab",
    PANEL = "panel",
    TOOL = "tool"
}
export declare type Types = types | string;
export declare function isSupportedType(type: Types): boolean;
