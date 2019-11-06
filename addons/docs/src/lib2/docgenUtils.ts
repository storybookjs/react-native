/* eslint-disable no-underscore-dangle */
import { isNil } from 'lodash';
import { Component } from '../blocks/shared';

// export function hasDocgenSection(component: Component, section: string): boolean {
//   const docgenSection = getDocgenSection(component, section);

//   return !isNil(docgenSection) && Object.keys(docgenSection).length > 0;
// }

export function hasDocgen(component: Component): boolean {
  return !!component.__docgenInfo;
}

export function isValidDocgenSection(docgenSection: any) {
  return !isNil(docgenSection) && Object.keys(docgenSection).length > 0;
}

export function getDocgenSection(component: Component, section: string): any {
  return hasDocgen(component) ? component.__docgenInfo[section] : null;
}
