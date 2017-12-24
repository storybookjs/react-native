// We could use NgComponentOutlet here but there's currently no easy way
// to provide @Inputs and subscribe to @Outputs, see
// https://github.com/angular/angular/issues/15360
// For the time being, the ViewContainerRef approach works pretty well.
import * as _ from 'lodash';
import {
  Component,
  Inject,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy,
  EventEmitter,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { STORY } from '../app.token';
import { NgStory, ICollection } from '../types';

@Component({
  selector: 'app-root',
  template: '<ng-template #target></ng-template>'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('target', { read: ViewContainerRef })
  target: ViewContainerRef;
  constructor(
    private cfr: ComponentFactoryResolver,
    @Inject(STORY) private data: NgStory
  ) {}

  ngAfterViewInit(): void {
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
  private setProps(instance: any, {props = {}, propsMeta = {}}: NgStory): void {
    const changes: SimpleChanges = {};
    const hasNgOnChangesHook = _.has(instance, 'ngOnChanges');

    _.forEach(propsMeta, (meta, key) => {
      const value = props[key];
      const instanceProperty = <any>_.get(instance, key);

      if (!(instanceProperty instanceof EventEmitter) && !_.isUndefined(value)) {
        _.set(instance, key, value);
        if (hasNgOnChangesHook) {
          changes[key] = new SimpleChange(undefined, value, instanceProperty === undefined);
        }
      } else if (_.isFunction(value) && (key !== 'ngModelChange')) {
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
    if (!_.isEmpty(changes)) {
      _.invoke(instance, 'ngOnChanges', changes);
    }
  }

  /**
   * If component implements ControlValueAccessor interface try to set ngModel
   */
  private setNgModel(instance: any, props: ICollection): void {
    if (_.has(props, 'ngModel')) {
      _.invoke(instance, 'writeValue', props.ngModel);
    }

    if (_.isFunction(props.ngModelChange)) {
        _.invoke(instance, 'registerOnChange', props.ngModelChange);
    }
  }
}
