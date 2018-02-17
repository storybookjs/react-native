/* eslint no-underscore-dangle: 0 */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Component, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { getParameters, getAnnotations } from './utils';

const getComponentMetadata = ({ component, props = {}, moduleMetadata = {} }) => {
  if (!component || typeof component !== 'function') throw new Error('No valid component provided');

  const componentMeta = getAnnotations(component)[0] || {};
  const paramsMetadata = getParameters(component);

  return {
    component,
    props,
    componentMeta,
    moduleMetadata,
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
  KnobWrapperComponent.annotations = [new Component(componentMeta)];
  KnobWrapperComponent.parameters = [[ChangeDetectorRef], ...params];

  KnobWrapperComponent.prototype.constructor = KnobWrapperComponent;
  KnobWrapperComponent.prototype.ngOnInit = function onInit() {
    if (component.prototype.ngOnInit) {
      component.prototype.ngOnInit.call(this);
    }

    channel.on('addon:knobs:knobChange', this.knobChanged);
    channel.on('addon:knobs:knobClick', this.knobClicked);
    knobStore.subscribe(this.setPaneKnobs);
    this.setPaneKnobs();
  };

  KnobWrapperComponent.prototype.ngOnDestroy = function onDestroy() {
    if (component.prototype.ngOnDestroy) {
      component.prototype.ngOnDestroy.call(this);
    }

    channel.removeListener('addon:knobs:knobChange', this.knobChanged);
    channel.removeListener('addon:knobs:knobClick', this.knobClicked);
    knobStore.unsubscribe(this.setPaneKnobs);
  };

  KnobWrapperComponent.prototype.ngOnChanges = function onChanges(changes) {
    if (component.prototype.ngOnChanges) {
      component.prototype.ngOnChanges.call(this, changes);
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
    this[name] = value;
    this.cd.detectChanges();
    this.ngOnChanges({
      [name]: new SimpleChange(oldValue, value, false),
    });
  };

  KnobWrapperComponent.prototype.knobClicked = function knobClicked(clicked) {
    const knobOptions = knobStore.get(clicked.name);
    knobOptions.callback();
  };

  return KnobWrapperComponent;
};

const createComponentFromTemplate = (template, styles) => {
  const componentClass = class DynamicComponent {};

  return Component({
    template,
    styles,
  })(componentClass);
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
  const story = getStory(context);
  let { component } = story;
  const { template, styles } = story;

  if (!component) {
    component = createComponentFromTemplate(template, styles);
  }

  const { componentMeta, props, params, moduleMetadata } = getComponentMetadata({
    ...story,
    component,
  });

  if (!componentMeta && component) throw new Error('No component metadata available');

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
    moduleMetadata,
  };
}
