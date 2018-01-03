import * as _ from 'lodash';

import {
  EventEmitter,
  SimpleChanges,
  SimpleChange,
} from '@angular/core';

import { NgStory, ICollection } from './types';


/**
 * Set inputs and outputs
 */
function setProps(instance: any, {props = {}, propsMeta = {}}: NgStory): void {
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

  callNgOnChangesHook(instance, changes);
  setNgModel(instance, props);
}

/**
 * Manually call 'ngOnChanges' hook because angular doesn't do that for dynamic components
 * Issue: [https://github.com/angular/angular/issues/8903]
 */
function callNgOnChangesHook(instance: any, changes: SimpleChanges): void {
  if (!_.isEmpty(changes)) {
    _.invoke(instance, 'ngOnChanges', changes);
  }
}

/**
 * If component implements ControlValueAccessor interface try to set ngModel
 */
function setNgModel(instance: any, props: ICollection): void {
  if (_.has(props, 'ngModel')) {
    _.invoke(instance, 'writeValue', props.ngModel);
  }

  if (_.isFunction(props.ngModelChange)) {
    _.invoke(instance, 'registerOnChange', props.ngModelChange);
  }
}

export { setProps };