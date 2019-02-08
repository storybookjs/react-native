// We could use NgComponentOutlet here but there's currently no easy way
// to provide @Inputs and subscribe to @Outputs, see
// https://github.com/angular/angular/issues/15360
// For the time being, the ViewContainerRef approach works pretty well.

import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  EventEmitter,
  SimpleChanges,
  SimpleChange,
  // tslint:disable-next-line:no-implicit-dependencies
} from '@angular/core';
import { STORY } from './app.token';
import { NgStory, ICollection } from './types';

@Component({
  selector: 'storybook-dynamic-app-root',
  template: '<ng-template #target></ng-template>',
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('target', { read: ViewContainerRef })
  target: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver, @Inject(STORY) private data: NgStory) {}

  ngOnInit(): void {
    this.putInMyHtml();
  }

  ngOnDestroy(): void {
    this.target.clear();
  }

  private putInMyHtml(): void {
    this.target.clear();
    const compFactory = this.cfr.resolveComponentFactory(this.data.component);
    const instance = this.target.createComponent(compFactory).instance;

    this.setProps(instance, this.data);
  }

  /**
   * Set inputs and outputs
   */
  private setProps(instance: any, { props = {} }: NgStory): void {
    const changes: SimpleChanges = {};
    const hasNgOnChangesHook = !!instance['ngOnChanges'];

    Object.keys(props).map((key: string) => {
      const value = props[key];
      const instanceProperty = instance[key];

      if (!(instanceProperty instanceof EventEmitter) && !!value) {
        instance[key] = value;
        if (hasNgOnChangesHook) {
          changes[key] = new SimpleChange(undefined, value, instanceProperty === undefined);
        }
      } else if (typeof value === 'function' && key !== 'ngModelChange') {
        instanceProperty.subscribe(value);
      }
    });

    this.callNgOnChangesHook(instance, changes);
    this.setNgModel(instance, props);
  }

  /**
   * Manually call 'ngOnChanges' hook because angular doesn't do that for dynamic components
   * Issue: [https://github.com/angular/angular/issues/8903]
   */
  private callNgOnChangesHook(instance: any, changes: SimpleChanges): void {
    if (!!Object.keys(changes).length) {
      instance.ngOnChanges(changes);
    }
  }

  /**
   * If component implements ControlValueAccessor interface try to set ngModel
   */
  private setNgModel(instance: any, props: ICollection): void {
    if (!!props['ngModel']) {
      instance.writeValue(props.ngModel);
    }

    if (typeof props.ngModelChange === 'function') {
      instance.registerOnChange(props.ngModelChange);
    }
  }
}
