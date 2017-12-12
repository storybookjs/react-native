/* eslint-disable no-param-reassign */
/* globals window */

import { VERSION } from '@angular/core';

function getMeta(component, [name1, name2], defaultValue) {
  if (!name2) {
    name2 = name1;
    name1 = `__${name1}__`;
  }

  if (VERSION.major === '5') {
    if (component[name1]) {
      return component[name1];
    }

    if (component[name2]) {
      return component[name2];
    }
  }

  if (VERSION.major === '4') {
    return window.Reflect.getMetadata(name2, component) || defaultValue;
  }

  return defaultValue;
}

function setMeta(component, [name1, name2], value) {
  if (!name2) {
    name2 = name1;
    name1 = `__${name1}__`;
  }

  if (VERSION.major === '5') {
    component[name1] = value;
  }

  if (VERSION.major === '4') {
    window.Reflect.defineMetadata(name2, value, component);
  }
}

export function getAnnotations(component) {
  return getMeta(component, ['annotations'], []);
}

export function getPropMetadata(component) {
  return getMeta(component, ['__prop__metadata__', 'propMetadata'], {});
}

export function getParameters(component) {
  return getMeta(component, ['parameters'], []);
}

export function setAnnotations(component, value) {
  setMeta(component, ['annotations'], value);
}

export function setParameters(component, value) {
  setMeta(component, ['parameters'], value);
}
