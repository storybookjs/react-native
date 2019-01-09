import { OnInit, ViewContainerRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { NgStory } from './types';
export declare class AppComponent implements OnInit, OnDestroy {
    private cfr;
    private data;
    target: ViewContainerRef;
    constructor(cfr: ComponentFactoryResolver, data: NgStory);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private putInMyHtml;
    /**
     * Set inputs and outputs
     */
    private setProps;
    /**
     * Manually call 'ngOnChanges' hook because angular doesn't do that for dynamic components
     * Issue: [https://github.com/angular/angular/issues/8903]
     */
    private callNgOnChangesHook;
    /**
     * If component implements ControlValueAccessor interface try to set ngModel
     */
    private setNgModel;
}
