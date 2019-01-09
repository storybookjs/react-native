import { InjectionToken, Injector, ElementRef } from '@angular/core';
export declare const TEST_TOKEN: InjectionToken<string>;
export declare class DiComponent {
    protected injector: Injector;
    protected elRef: ElementRef;
    protected testToken: number;
    title: string;
    constructor(injector: Injector, elRef: ElementRef, testToken: number);
    isAllDeps(): boolean;
    elRefStr(): string;
}
