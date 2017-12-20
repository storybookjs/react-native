/* eslint no-underscore-dangle: 0 */

import { Component, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { getParameters, getAnnotations, getPropMetadata } from './utils';

const getComponentMetadata = ({ component, props = {}, pipes = [] }) => {
  if (!component || typeof component !== 'function') throw new Error('No valid component provided');

  const componentMeta = getAnnotations(component)[0] || {};
  const propsMeta = getPropMetadata(component);
  const paramsMetadata = getParameters(component);

  return {
    component,
    props,
    pipes,
    componentMeta,
    propsMeta,
    params: paramsMetadata,
  };
};

const getAnnotatedComponent = ({ componentMeta, component, params, knobStore, channel }) => {
  const KnobWrapperComponent = function KnobWrapperComponent(cd, ...args) {
    component.call(this, ...args);
    this.cd = cd;
    this.knobChanged = this.knobChanged.bind(this);
    this.setPaneKnobs = this.setPaneKnobs.bind(this);
  };

  KnobWrapperComponent.prototype = Object.create(component.prototype);
  KnobWrapperComponent.__annotations__ = [new Component(componentMeta)];
  KnobWrapperComponent.__parameters__ = [[ChangeDetectorRef], ...params];

  KnobWrapperComponent.prototype.constructor = KnobWrapperComponent;
  KnobWrapperComponent.prototype.ngOnInit = function onInit() {
    if (component.prototype.ngOnInit) {
      component.prototype.ngOnInit();
    }

    channel.on('addon:knobs:knobChange', this.knobChanged);
    channel.on('addon:knobs:knobClick', this.knobClicked);
    knobStore.subscribe(this.setPaneKnobs);
    this.setPaneKnobs();
  };

  KnobWrapperComponent.prototype.ngOnDestroy = function onDestroy() {
    if (component.prototype.ngOnDestroy) {
      component.prototype.ngOnDestroy();
    }

    channel.removeListener('addon:knobs:knobChange', this.knobChanged);
    channel.removeListener('addon:knobs:knobClick', this.knobClicked);
    knobStore.unsubscribe(this.setPaneKnobs);
  };

  KnobWrapperComponent.prototype.ngOnChanges = function onChanges(changes) {
    if (component.prototype.ngOnChanges) {
      component.prototype.ngOnChanges(changes);
    }
  };

  KnobWrapperComponent.prototype.setPaneKnobs = function setPaneKnobs(timestamp = +new Date()) {
    channel.emit('addon:knobs:setKnobs', {
      knobs: knobStore.getAll(),
      timestamp,
    });
  };

  KnobWrapperComponent.prototype.knobChanged = function knobChanged(change) {
    const { name, value } = change;
    const knobOptions = knobStore.get(name);
    const oldValue = knobOptions.value;
    knobOptions.value = value;
    knobStore.markAllUnused();
    const lowercasedName = name.toLocaleLowerCase();
    this[lowercasedName] = value;
    this.cd.detectChanges();
    this.ngOnChanges({
      [lowercasedName]: new SimpleChange(oldValue, value, false),
    });
  };

  KnobWrapperComponent.prototype.knobClicked = function knobClicked(clicked) {
    const knobOptions = knobStore.get(clicked.name);
    knobOptions.callback();
  };

  return KnobWrapperComponent;
};

const resetKnobs = (knobStore, channel) => {
  knobStore.reset();
  channel.emit('addon:knobs:setKnobs', {
    knobs: knobStore.getAll(),
    timestamp: false,
  });
};

export function prepareComponent({ getStory, context, channel, knobStore }) {
  resetKnobs(knobStore, channel);
  const { component, componentMeta, props, pipes, propsMeta, params } = getComponentMetadata(
    getStory(context)
  );

  if (!componentMeta) throw new Error('No component metadata available');

  const AnnotatedComponent = getAnnotatedComponent({
    componentMeta,
    component,
    params,
    knobStore,
    channel,
  });

  return {
    component: AnnotatedComponent,
    props,
    pipes,
    propsMeta,
  };
}
