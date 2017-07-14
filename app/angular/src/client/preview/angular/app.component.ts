import { Component, Inject, AfterViewInit ,ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { STORY, Data } from './app.token';

@Component({
  selector: 'my-app',
  template: '<ng-template #target></ng-template>'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;
  constructor(
    private cfr: ComponentFactoryResolver,
    @Inject(STORY) private data: Data
  ) {}

  ngAfterViewInit() {
    this.putInMyHtml();
  }

  putInMyHtml() {
    this.target.clear();
    const { component, props = {}, propsMeta = {} } = this.data;
    let compFactory = this.cfr.resolveComponentFactory(component);
    const instance = this.target.createComponent(compFactory).instance;

    Object.keys(propsMeta).map((key) => {
      (<any>instance)[key] = props[key];
    });
  }
}