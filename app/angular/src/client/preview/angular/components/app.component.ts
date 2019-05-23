/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-parameter-properties */
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
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { STORY } from '../app.token';
import { NgStory, ICollection } from '../types';

@Component({
  selector: 'storybook-dynamic-app-root',
  template: '<ng-template #target></ng-template>',
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('target', { read: ViewContainerRef })
  target: ViewContainerRef;

  subscription: Subscription;

  constructor(
    private cfr: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(STORY) private data: Observable<NgStory>
  ) {}

  ngOnInit(): void {
    this.data.pipe(first()).subscribe((data: NgStory) => {
      this.target.clear();
      const compFactory = this.cfr.resolveComponentFactory(data.component);
      const componentRef = this.target.createComponent(compFactory);
      const { instance } = componentRef;
      // For some reason, manual change detection ref is only working when getting the ref from the injector (rather than componentRef.changeDetectorRef)
      const childChangeDetectorRef: ChangeDetectorRef = componentRef.injector.get(
        ChangeDetectorRef
      );

      this.subscription = this.data.subscribe(newData => {
        this.setProps(instance, newData);
        childChangeDetectorRef.markForCheck();
        // Must detect changes on the current component in order to update any changes in child component's @HostBinding properties (angular/angular#22560)
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.target.clear();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Set inputs and outputs
   */
  private setProps(instance: any, { props = {} }: NgStory): void {
    const changes: SimpleChanges = {};
    const hasNgOnChangesHook = !!instance.ngOnChanges;

    Object.keys(props).forEach((key: string) => {
      const value = props[key];
      const instanceProperty = instance[key];

      if (!(instanceProperty instanceof EventEmitter) && (value !== undefined && value !== null)) {
        // eslint-disable-next-line no-param-reassign
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
    if (Object.keys(changes).length) {
      instance.ngOnChanges(changes);
    }
  }

  /**
   * If component implements ControlValueAccessor interface try to set ngModel
   */
  private setNgModel(instance: any, props: ICollection): void {
    if (props.ngModel) {
      instance.writeValue(props.ngModel);
    }

    if (typeof props.ngModelChange === 'function') {
      instance.registerOnChange(props.ngModelChange);
    }
  }
}
