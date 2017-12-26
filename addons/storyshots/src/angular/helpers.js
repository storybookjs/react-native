import { Component } from '@angular/core';
import { getPropMetadata, getAnnotations, getParameters } from './utils';

function getComponentMetadata({ component, props = {}, propsMeta = {}, moduleMetadata = {} }) {
  const componentMetadata = getAnnotations(component)[0] || {};
  const propsMetadata = getPropMetadata(component);
  const paramsMetadata = getParameters(component);

  // Object.keys(propsMeta).forEach(key => {
  //   propsMetadata[key] = props[key];
  // });

  Object.keys(propsMeta).forEach(key => {
    propsMetadata[key] = propsMeta[key];
  });

  const { imports = [], schemas = [], declarations = [], providers = [] } = moduleMetadata;

  return {
    component,
    props,
    componentMeta: componentMetadata,
    propsMeta: propsMetadata,
    params: paramsMetadata,
    moduleMeta: {
      imports,
      schemas,
      declarations,
      providers,
    },
  };
}

function getAnnotatedComponent(meta, component, propsMeta, params) {
  const StoryshotComponent = function StoryshotComponent(...args) {
    component.call(this, ...args);
  };

  StoryshotComponent.prototype = Object.create(component.prototype);
  StoryshotComponent.annotations = [new Component(meta)];
  StoryshotComponent.parameters = params;
  StoryshotComponent.propsMetadata = propsMeta;

  return StoryshotComponent;
}

export function createAnnotatedComponent(story) {
  const { component, componentMeta, props, propsMeta, params, moduleMeta } = getComponentMetadata(
    story
  );

  const AnnotatedComponent = getAnnotatedComponent(componentMeta, component, propsMeta, [
    ...params,
    ...moduleMeta.providers.map(provider => [provider]),
  ]);

  return {
    component: AnnotatedComponent,
    props,
    propsMeta,
  };
}
