import { InjectionToken } from '@angular/core';
export declare const ITEMS: InjectionToken<string[]>;
export declare const DEFAULT_NAME: InjectionToken<string>;
export declare class TokenComponent {
    items: any;
    name: any;
    constructor(defaultName: string, items: string[]);
}
