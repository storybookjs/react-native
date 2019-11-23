/* eslint-disable no-underscore-dangle */

import { isNil } from 'lodash';
import { Component } from '../../../blocks/shared';
import { str } from './string';

export function hasDocgen(component: Component): boolean {
  return !!component.__docgenInfo;
}

export function isValidDocgenSection(docgenSection: any) {
  return !isNil(docgenSection) && Object.keys(docgenSection).length > 0;
}

export function getDocgenSection(component: Component, section: string): any {
  return hasDocgen(component) ? component.__docgenInfo[section] : null;
}

export function getDocgenDescription(component: Component): string {
  return hasDocgen(component) && str(component.__docgenInfo.description);
}
