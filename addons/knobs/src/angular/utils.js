/* globals window */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ɵReflectionCapabilities } from '@angular/core';

// eslint-disable-next-line new-cap
const reflectionCapabilities = new ɵReflectionCapabilities();

function getMeta(component, [name1, name2], defaultValue) {
  if (!name2) {
    name2 = name1;
    name1 = `__${name1}__`;
  }

  if (component[name1]) {
    return component[name1];
  }

  if (component[name2]) {
    return component[name2];
  }

  return window.Reflect.getMetadata(name2, component) || defaultValue;
}

export function getAnnotations(component) {
  return getMeta(component, ['annotations'], []);
}

export function getPropMetadata(component) {
  return getMeta(component, ['__prop__metadata__', 'propMetadata'], {});
}

export function getParameters(component) {
  const params = reflectionCapabilities.parameters(component);

  if (!params || !params[0]) {
    return getMeta(component, ['parameters'], []);
  }

  return params;
}
