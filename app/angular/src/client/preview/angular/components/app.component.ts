// We could use NgComponentOutlet here but there's currently no easy way
// to provide @Inputs and subscribe to @Outputs, see
// https://github.com/angular/angular/issues/15360
// For the time being, the ViewContainerRef approach works pretty well.

import {
  Component,
  Inject,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  EventEmitter
} from "@angular/core";
import { STORY, Data } from "../app.token";

@Component({
  selector: "my-app",
  template: "<ng-template #target></ng-template>"
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild("target", { read: ViewContainerRef })
  target: ViewContainerRef;
  constructor(
    private cfr: ComponentFactoryResolver,
    @Inject(STORY) private data: Data
  ) {}

  ngAfterViewInit() {
    this.putInMyHtml();
  }

  ngOnDestroy() {
    this.target.clear();
  }

  putInMyHtml() {
    this.target.clear();
    const { component, props = {}, propsMeta = {} } = this.data;
    let compFactory = this.cfr.resolveComponentFactory(component);
    const instance = this.target.createComponent(compFactory).instance;

    Object.keys(propsMeta).map(key => {
      const value = (<any>props)[key];
      const property = (<any>instance)[key];

      if (!(property instanceof EventEmitter)) {
          (<any>instance)[key] = (<any>props)[key];
      } else if (typeof value === 'function') {
          property.subscribe((<any>props)[key]);
      }
    });
  }
}