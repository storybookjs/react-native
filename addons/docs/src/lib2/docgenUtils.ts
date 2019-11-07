/* eslint-disable no-underscore-dangle */

import { isNil } from 'lodash';
import { Component } from '../blocks/shared';

export function unquote(text: string) {
  return text && text.replace(/^['"]|['"]$/g, '');
}

// TODO: Might not need this.
export function showSpaces(text: string) {
  return text && text.replace(/^\s|\s$/g, '␣');
}

export function hasDocgen(component: Component): boolean {
  return !!component.__docgenInfo;
}

export function isValidDocgenSection(docgenSection: any) {
  return !isNil(docgenSection) && Object.keys(docgenSection).length > 0;
}

export function getDocgenSection(component: Component, section: string): any {
  return hasDocgen(component) ? component.__docgenInfo[section] : null;
}
